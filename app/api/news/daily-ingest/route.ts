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

type StorySection =
  | "news"
  | "business-tech"
  | "opinion"
  | "data-stats"
  | "states-territories";

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

type CandidateWithTopic = CandidateArticle & {
  topic: string;
};

type GeneratedDraft = {
  headline?: string;
  excerpt?: string;
  summary?: string;
  why_it_matters?: string;
  section?: StorySection;
  category?: string;
  reading_time?: number;
  x_post?: string;
  facebook_post?: string;
  confidence?: number;
};

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase admin environment variables");
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

function dedupeByUrl<T extends { url: string }>(articles: T[]): T[] {
  const seen = new Set<string>();

  return articles.filter((article) => {
    if (!article.url || seen.has(article.url)) return false;
    seen.add(article.url);
    return true;
  });
}

function labelForRunDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function buildQuery(topic: string) {
  const base = [
    `"South Sudan"`,
    `"Juba"`,
    `"South Sudan government"`,
    `"South Sudan economy"`,
    `"South Sudan conflict"`,
  ];

  const topicMap: Record<string, string[]> = {
    politics: [`politics`, `"government"`, parliament, president],
    economy: [`economy`, inflation, market, trade, business],
    security: [security, conflict, violence, peace],
    health: [health, hospital, disease, cholera],
    education: [education, school, university, students],
    oil: [oil, petroleum, energy, pipeline],
    diplomacy: [diplomacy, embassy, bilateral, regional],
    infrastructure: [infrastructure, roads, transport, electricity],
    agriculture: [agriculture, farming, food, harvest],
    sport: [sport, football, basketball, tournament],
  };

  const topicTerms = topicMap[topic] ?? [topic];

  return `${base.join(" OR ")} AND (${topicTerms.join(" OR ")})`;
}

async function fetchNewsForTopic(topic: string, from: string) {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    throw new Error("Missing NEWS_API_KEY");
  }

  const params = new URLSearchParams({
    q: buildQuery(topic),
    language: "en",
    sortBy: "publishedAt",
    pageSize: "20",
    from,
    searchIn: "title,description,content",
    apiKey,
  });

  const response = await fetch(
    `https://newsapi.org/v2/everything?${params.toString()}`,
    {
      headers: { Accept: "application/json" },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`News fetch failed for ${topic}: ${response.status} ${text}`);
  }

  const json = await response.json();
  return (json.articles ?? []) as CandidateArticle[];
}

async function generateEditorialDraft(
  openai: OpenAI,
  article: CandidateArticle,
  topic: string
) {
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

  return JSON.parse(
    completion.choices[0]?.message?.content ?? "{}"
  ) as GeneratedDraft;
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("x-ingest-secret");
  if (auth !== process.env.NEWS_INGEST_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    return NextResponse.json(
      { error: "Missing OPENAI_API_KEY" },
      { status: 500 }
    );
  }

  const supabase = getSupabaseAdmin();
  const openai = new OpenAI({ apiKey: openaiApiKey });

  const today = new Date();
  const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

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
    .insert({
      run_date: today.toISOString().slice(0, 10),
      status: "running",
    })
    .select("id")
    .single();

  const jobId = jobInsert.data?.id;

  try {
    let createdCount = 0;
    let fetchedBeforeFilter = 0;
    let candidates: CandidateWithTopic[] = [];

    for (const topic of topicBuckets) {
      const articles = await fetchNewsForTopic(topic, from);
      console.log(`topic=${topic}, fetched=${articles.length}`);
      fetchedBeforeFilter += articles.length;
      candidates.push(...articles.map((article) => ({ ...article, topic })));
    }

    candidates = dedupeByUrl(candidates)
      .filter(
        (article) =>
          article.title &&
          article.url &&
          article.source?.name &&
          !article.title.toLowerCase().includes("[removed]")
      )
      .slice(0, 40);

    const picked = candidates.slice(0, 5);

    for (const article of picked) {
      const draft = await generateEditorialDraft(openai, article, article.topic);

      const fallbackSection =
        SECTION_MAP[
          (article.topic in SECTION_MAP
            ? article.topic
            : "politics") as keyof typeof SECTION_MAP
        ] ?? "news";

      const section: StorySection = draft.section ?? fallbackSection;

      const slugBase = (draft.headline ?? article.title)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .slice(0, 80);

      const slug = `${slugBase}-${Date.now()}`;

      const storyInsert = await supabase
        .from("stories")
        .insert({
          title: draft.headline ?? article.title,
          slug,
          excerpt: draft.excerpt ?? article.description ?? "",
          content: draft.summary ?? "",
          section,
          category: draft.category ?? labelForRunDate(today),
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

      console.log("story insert result:", storyInsert.data, storyInsert.error);

      const storyId = storyInsert.data?.id;
      if (!storyId) continue;

      createdCount += 1;

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

    if (jobId) {
      await supabase
        .from("news_jobs")
        .update({
          status: "completed",
          notes: `fetched=${fetchedBeforeFilter}, usable=${candidates.length}, selected=${picked.length}, created=${createdCount}`,
          updated_at: new Date().toISOString(),
        })
        .eq("id", jobId);
    }

    return NextResponse.json({
      ok: true,
      fetched: fetchedBeforeFilter,
      usable: candidates.length,
      selected: picked.length,
      created: createdCount,
    });
  } catch (error) {
    if (jobId) {
      await supabase
        .from("news_jobs")
        .update({
          status: "failed",
          notes: error instanceof Error ? error.message : "Unknown error",
          updated_at: new Date().toISOString(),
        })
        .eq("id", jobId);
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}