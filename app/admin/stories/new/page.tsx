"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import StoryEditor from "@/components/admin/StoryEditor";

const SECTION_OPTIONS = [
  { label: "States & Territories", value: "states-territories" },
  { label: "Business", value: "business" },
  { label: "Opinion", value: "opinion" },
  { label: "Sports", value: "sports" },
  { label: "Health", value: "health" },
  { label: "Education", value: "education" },
  { label: "Environment", value: "environment" },
  { label: "Data & Statistics", value: "data-statistics" },
];

export default function NewStoryPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    section: "states-territories",
    category: "",
    status: "draft",
    body_html: "<p></p>",
    featured_image_url: "",
    seo_title: "",
    seo_description: "",
  });

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

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
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in.");
      }

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
        author_id: user.id,
        published_at: form.status === "published" ? new Date().toISOString() : null,
      };

      if (!payload.title || !payload.slug || !payload.body_html) {
        throw new Error("Title, slug, and story body are required.");
      }

      const { error } = await supabase.from("stories").insert(payload);

      if (error) {
        throw error;
      }

      setFeedback("Story saved successfully.");
      router.push("/admin/stories");
      router.refresh();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Unable to save story.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="max-w-3xl">
        <h1 className="text-5xl font-semibold tracking-tight text-[#2f2f2f]">
          New story
        </h1>
        <p className="mt-4 text-lg text-[#555]">
          Create a draft, review it, and publish when ready.
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

        <div className="grid gap-6 md:grid-cols-3">
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
            {saving ? "Saving..." : "Save story"}
          </button>

          {feedback ? (
            <p className="text-sm text-[#555]">{feedback}</p>
          ) : null}
        </div>
      </form>
    </main>
  );
}