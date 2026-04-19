"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import slugify from "slugify";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import StoryEditor from "@/components/admin/StoryEditor";

const SECTION_OPTIONS = [
  { label: "News", value: "south-sudan" },
  { label: "Business & Tech", value: "business" },
  { label: "Opinion", value: "opinion" },
  { label: "Politics", value: "politics" },
  { label: "Health", value: "health" },
  { label: "Education", value: "education" },
  { label: "Environment", value: "environment" },
  { label: "States & Territories", value: "states-territories" },
  { label: "Data & Statistics", value: "data-statistics" },
];

type AuthorOption = {
  id: string;
  display_name: string | null;
  full_name: string | null;
  role: string | null;
};

export default function EditStoryPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const storyId = String(params.id);

  const [authors, setAuthors] = useState<AuthorOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    section: "south-sudan",
    category: "",
    status: "draft",
    body_html: "<p></p>",
    featured_image_url: "",
    seo_title: "",
    seo_description: "",
    author_id: "",
  });

  useEffect(() => {
    async function loadPage() {
      setLoading(true);

      const [{ data: authorData }, { data: storyData, error: storyError }] =
        await Promise.all([
          supabase
            .from("authors")
            .select("id, display_name, full_name, role")
            .order("display_name", { ascending: true }),
          supabase
            .from("stories")
            .select(
              "id, title, slug, excerpt, section, category, status, body_html, featured_image_url, seo_title, seo_description, author_id"
            )
            .eq("id", storyId)
            .single(),
        ]);

      if (authorData) {
        setAuthors(authorData);
      }

      if (storyError || !storyData) {
        setFeedback(storyError?.message || "Story not found.");
      } else {
        setForm({
          title: storyData.title ?? "",
          slug: storyData.slug ?? "",
          excerpt: storyData.excerpt ?? "",
          section: storyData.section ?? "south-sudan",
          category: storyData.category ?? "",
          status: storyData.status ?? "draft",
          body_html: storyData.body_html ?? "<p></p>",
          featured_image_url: storyData.featured_image_url ?? "",
          seo_title: storyData.seo_title ?? "",
          seo_description: storyData.seo_description ?? "",
          author_id: storyData.author_id ?? authorData?.[0]?.id ?? "",
        });
      }

      setLoading(false);
    }

    loadPage();
  }, [storyId, supabase]);

  const readingTime = useMemo(() => {
    const plainText = form.body_html.replace(/<[^>]+>/g, " ").trim();
    const words = plainText ? plainText.split(/\s+/).length : 0;
    return Math.max(1, Math.ceil(words / 200));
  }, [form.body_html]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    if (name === "title") {
      setForm((current) => ({
        ...current,
        title: value,
        slug:
          current.slug.trim().length > 0
            ? current.slug
            : slugify(value, { lower: true, strict: true }),
      }));
      return;
    }

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFeedback("");

    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        excerpt: form.excerpt.trim() || null,
        section: form.section,
        category: form.category.trim() || null,
        status: form.status,
        body_html: form.body_html,
        featured_image_url: form.featured_image_url.trim() || null,
        seo_title: form.seo_title.trim() || null,
        seo_description: form.seo_description.trim() || null,
        reading_time: readingTime,
        author_id: form.author_id || null,
        published_at: form.status === "published" ? new Date().toISOString() : null,
      };

      if (!payload.title || !payload.slug || !payload.body_html) {
        throw new Error("Title, slug, and story body are required.");
      }

      const { error } = await supabase
        .from("stories")
        .update(payload)
        .eq("id", storyId);

      if (error) throw error;

      router.push("/admin/stories");
      router.refresh();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Unable to update story.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-sm text-slate-500">Loading story...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="max-w-3xl">
        <h1 className="text-5xl font-semibold tracking-tight text-[#2f2f2f]">
          Edit story
        </h1>
        <p className="mt-4 text-lg text-[#555]">
          Update story content, author details, and publishing status.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#333]">
              Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-[#d8d8d8] px-4 py-3 outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#333]">
              Slug
            </label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              className="w-full border border-[#d8d8d8] px-4 py-3 outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#333]">
            Excerpt
          </label>
          <textarea
            name="excerpt"
            rows={4}
            value={form.excerpt}
            onChange={handleChange}
            className="w-full border border-[#d8d8d8] px-4 py-3 outline-none"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#333]">
              Section
            </label>
            <select
              name="section"
              value={form.section}
              onChange={handleChange}
              className="w-full border border-[#d8d8d8] px-4 py-3"
            >
              {SECTION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#333]">
              Category
            </label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-[#d8d8d8] px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#333]">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border border-[#d8d8d8] px-4 py-3"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#333]">
              Author
            </label>
            <select
              name="author_id"
              value={form.author_id}
              onChange={handleChange}
              className="w-full border border-[#d8d8d8] px-4 py-3"
            >
              {authors.length === 0 ? (
                <option value="">No authors found</option>
              ) : (
                authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.display_name || author.full_name || "Unnamed author"}
                    {author.role ? ` — ${author.role}` : ""}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#333]">
            Story body
          </label>
          <StoryEditor
            value={form.body_html}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                body_html: value,
              }))
            }
          />
          <p className="mt-2 text-sm text-slate-500">{readingTime} min read</p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#333]">
            Featured image URL
          </label>
          <input
            name="featured_image_url"
            value={form.featured_image_url}
            onChange={handleChange}
            className="w-full border border-[#d8d8d8] px-4 py-3 outline-none"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#333]">
              SEO title
            </label>
            <input
              name="seo_title"
              value={form.seo_title}
              onChange={handleChange}
              className="w-full border border-[#d8d8d8] px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#333]">
              SEO description
            </label>
            <input
              name="seo_description"
              value={form.seo_description}
              onChange={handleChange}
              className="w-full border border-[#d8d8d8] px-4 py-3 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#2f6e57] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Update story"}
          </button>

          {feedback ? <p className="text-sm text-[#555]">{feedback}</p> : null}
        </div>
      </form>
    </main>
  );
}