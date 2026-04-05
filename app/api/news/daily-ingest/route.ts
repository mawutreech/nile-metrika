import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

const SECTION_MAP = {
  politics: "news",
  diplomacy: "news",
  security: "news",
  economy: "business-tech",
  oil: "business-tech",
  technology: "business-tech",
  health: "data-stats",
  education: "data-stats",
  humanitarian: "data-stats",
  regions: "states-territories",
} as const;

type CandidateArticle = {
  title: string;
  description?: string | null;
  url: string;
  urlToImage?: string | null;
  publishedAt?: string | null;
  source?: { name?: string | null };
  author?: string | null;
  content?: string | null;
};

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function dedupeByUrl(articles: CandidateArticle[]) {
  const seen = new Set<string>();
  return articles.filter((article) => {
    if (!article.url || seen.has(article.url)) return false;
    seen.add(article.url);
    return true;
  });
}

function weekdayName(date: Date) {
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

async function fetchNewsForTopic(topic: string, from: string) {
  const params = new URLSearchParams({
    q: `"South Sudan" AND ${topic}`,
    language: "en",
    sortBy: "publishedAt",
    pageSize: "15",
    from,
    apiKey: process.env.NEWS_API_KEY!,
  });

  const response = await fetch(`https://newsapi.org/v2/everything?${params.toString()}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`News fetch failed for ${topic}: ${response.status}`);
  }

  const json = await response.json();
  return (json.articles ?? []) as CandidateArticle[];
}

async function generateEditorialDraft(openai: OpenAI, article: CandidateArticle, topic: string) {
  const prompt = `
You are an editor for Nile Metrica, a South Sudan knowledge portal.

Write ORIGINAL newsroom copy based only on the source facts below.
Do not copy or closely paraphrase the source wording.
Be concise, interesting, factual, and informative.

Return valid JSON with keys:
headline
excerpt
summary
why_it_matters
section
category
reading_time
x_post
facebook_post
confidence

Rules:
- section must be one of: news, business-tech, opinion, data-stats, states-territories
- confidence should be a number from 0 to 1
- x_post under 280 characters
- facebook_post 2 to 4 sentences
- category should be a short label
- summary should be 3 short paragraphs max
- no markdown

Topic hint: ${topic}

Source title: ${article.title}
Source description: ${article.description ?? ""}
Source publisher: ${article.source?.name ?? ""}
Source publishedAt: ${article.publishedAt ?? ""}
Source content: ${article.content ?? ""}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0.5,
    response_format: { type: "json_object" },
    messages: [{ role: "user", content: prompt }],
  });

  return JSON.parse(completion.choices[0]?.message?.content ?? "{}");
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("x-ingest-secret");
  if (auth !== process.env.NEWS_INGEST_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const today = new Date();
  const day = today.getDay();
  if (day === 0 || day === 6) {
    return NextResponse.json({ ok: true, skipped: "Weekend" });
  }

  const from = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const topicBuckets = [
    "politics",
    "economy",
    "security",
    "health",
    "education",
    "oil",
    "diplomacy",
    "infrastructure",
    "agriculture",
    "sport",
  ];

  const jobInsert = await supabase
    .from("news_jobs")
    .insert({ run_date: today.toISOString().slice(0, 10), status: "running" })
    .select("id")
    .single();

  const jobId = jobInsert.data?.id;

  try {
    let candidates: Array<CandidateArticle & { topic: string }> = [];

    for (const topic of topicBuckets) {
      const articles = await fetchNewsForTopic(topic, from);
      candidates.push(...articles.map((a) => ({ ...a, topic })));
    }

    candidates = dedupeByUrl(candidates)
      .filter((a) => a.title && a.url && a.source?.name)
      .slice(0, 40);

    const picked = candidates.slice(0, 5);

    for (const article of picked) {
      const draft = await generateEditorialDraft(openai, article, article.topic);

      const section =
        draft.section ||
        SECTION_MAP[
          (article.topic in SECTION_MAP ? article.topic : "politics") as keyof typeof SECTION_MAP
        ] ||
        "news";

      const storyInsert = await supabase
        .from("stories")
        .insert({
          title: draft.headline ?? article.title,
          slug: crypto.randomUUID(),
          excerpt: draft.excerpt ?? article.description ?? "",
          content: draft.summary ?? "",
          section,
          category: draft.category ?? weekdayName(today),
          status: "draft",
          ai_generated: true,
          ai_confidence: draft.confidence ?? 0.5,
          source_url: article.url,
          source_name: article.source?.name ?? null,
          source_published_at: article.publishedAt ?? null,
          editor_status: "editor_review",
          why_it_matters: draft.why_it_matters ?? null,
          reading_time: draft.reading_time ?? 2,
        })
        .select("id, title")
        .single();

      const storyId = storyInsert.data?.id;
      if (!storyId) continue;

      await supabase.from("story_sources").insert({
        story_id: storyId,
        source_name: article.source?.name ?? "Unknown source",
        source_url: article.url,
        source_title: article.title,
        source_author: article.author ?? null,
        source_published_at: article.publishedAt ?? null,
        source_image_url: article.urlToImage ?? null,
        raw_payload: article,
      });

      await supabase.from("social_posts").insert([
        {
          story_id: storyId,
          platform: "x",
          body: draft.x_post ?? "",
          status: "draft",
        },
        {
          story_id: storyId,
          platform: "facebook",
          body: draft.facebook_post ?? "",
          status: "draft",
        },
      ]);
    }

    await supabase
      .from("news_jobs")
      .update({ status: "completed", updated_at: new Date().toISOString() })
      .eq("id", jobId);

    return NextResponse.json({
      ok: true,
      created: picked.length,
    });
  } catch (error) {
    await supabase
      .from("news_jobs")
      .update({
        status: "failed",
        notes: error instanceof Error ? error.message : "Unknown error",
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}