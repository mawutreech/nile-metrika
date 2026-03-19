"use client";

import { useEffect, useMemo, useState } from "react";
import slugify from "slugify";
import StoryEditor from "@/components/admin/StoryEditor";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type StoryStatus = "draft" | "review" | "published";
type StorySection =
  | "south-sudan"
  | "business"
  | "politics"
  | "opinion"
  | "culture-sport";

export type StoryFormInitialData = {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string | null;
  body_html?: string;
  featured_image_url?: string | null;
  section?: StorySection;
  category?: string | null;
  status?: StoryStatus;
  seo_title?: string | null;
  seo_description?: string | null;
};

type Props = {
  mode?: "create" | "edit";
  initialData?: StoryFormInitialData;
};

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function estimateReadingTime(html: string) {
  const words = stripHtml(html).split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function StoryForm({
  mode = "create",
  initialData,
}: Props) {
  const supabase = createSupabaseBrowserClient();

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [bodyHtml, setBodyHtml] = useState(initialData?.body_html ?? "<p></p>");
  const [section, setSection] = useState<StorySection>(
    initialData?.section ?? "south-sudan"
  );
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [status, setStatus] = useState<StoryStatus>(
    initialData?.status ?? "draft"
  );
  const [seoTitle, setSeoTitle] = useState(initialData?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(
    initialData?.seo_description ?? ""
  );
  const [featuredImageUrl, setFeaturedImageUrl] = useState(
    initialData?.featured_image_url ?? ""
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (mode === "create") {
      setSlug(
        slugify(title || "", {
          lower: true,
          strict: true,
          trim: true,
        })
      );
    }
  }, [title, mode]);

  const readingTime = useMemo(() => estimateReadingTime(bodyHtml), [bodyHtml]);

  async function uploadImage(file: File) {
    setUploading(true);
    setMessage("");

    const ext = file.name.split(".").pop();
    const filePath = `stories/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("story-images")
      .upload(filePath, file);

    if (uploadError) {
      setUploading(false);
      setMessage(uploadError.message);
      return;
    }

    const { data } = supabase.storage.from("story-images").getPublicUrl(filePath);
    setFeaturedImageUrl(data.publicUrl);
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setSaving(false);
      setMessage("You must be logged in.");
      return;
    }

    const payload = {
      title,
      slug,
      excerpt: excerpt || null,
      body_html: bodyHtml,
      featured_image_url: featuredImageUrl || null,
      section,
      category: category || null,
      status,
      reading_time: readingTime,
      published_at: status === "published" ? new Date().toISOString() : null,
      seo_title: seoTitle || null,
      seo_description: seoDescription || null,
      updated_at: new Date().toISOString(),
    };

    if (mode === "edit" && initialData?.id) {
      const { error } = await supabase
        .from("stories")
        .update(payload)
        .eq("id", initialData.id);

      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Story updated successfully.");
      }

      setSaving(false);
      return;
    }

    const { error } = await supabase.from("stories").insert({
      ...payload,
      author_id: user.id,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Story saved successfully.");
      setTitle("");
      setSlug("");
      setExcerpt("");
      setBodyHtml("<p></p>");
      setCategory("");
      setSeoTitle("");
      setSeoDescription("");
      setFeaturedImageUrl("");
      setStatus("draft");
      setSection("south-sudan");
    }

    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block font-medium">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-slate-300 px-4 py-3"
          />
        </label>

        <label className="block">
          <span className="mb-2 block font-medium">Slug</span>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="w-full border border-slate-300 px-4 py-3"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block font-medium">Excerpt</span>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={3}
          className="w-full border border-slate-300 px-4 py-3"
        />
      </label>

      <div className="grid gap-6 md:grid-cols-3">
        <label className="block">
          <span className="mb-2 block font-medium">Section</span>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value as StorySection)}
            className="w-full border border-slate-300 px-4 py-3"
          >
            <option value="south-sudan">South Sudan</option>
            <option value="business">Business</option>
            <option value="politics">Politics</option>
            <option value="opinion">Opinion</option>
            <option value="culture-sport">Culture & Sport</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block font-medium">Category</span>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-slate-300 px-4 py-3"
          />
        </label>

        <label className="block">
          <span className="mb-2 block font-medium">Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StoryStatus)}
            className="w-full border border-slate-300 px-4 py-3"
          >
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="published">Published</option>
          </select>
        </label>
      </div>

      <div className="space-y-3">
        <span className="block font-medium">Featured image</span>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadImage(file);
          }}
        />

        {uploading ? <p className="text-sm text-slate-600">Uploading image...</p> : null}

        {featuredImageUrl ? (
          <div className="space-y-2">
            <img
              src={featuredImageUrl}
              alt="Featured"
              className="max-h-64 border"
            />
            <input
              value={featuredImageUrl}
              onChange={(e) => setFeaturedImageUrl(e.target.value)}
              className="w-full border border-slate-300 px-4 py-3"
            />
          </div>
        ) : null}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="font-medium">Story body</span>
          <span className="text-sm text-slate-600">{readingTime} min read</span>
        </div>
        <StoryEditor value={bodyHtml} onChange={setBodyHtml} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block font-medium">SEO title</span>
          <input
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className="w-full border border-slate-300 px-4 py-3"
          />
        </label>

        <label className="block">
          <span className="mb-2 block font-medium">SEO description</span>
          <input
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            className="w-full border border-slate-300 px-4 py-3"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="bg-emerald-700 px-5 py-3 font-medium text-white disabled:opacity-60"
      >
        {saving
          ? mode === "edit"
            ? "Updating..."
            : "Saving..."
          : mode === "edit"
          ? "Update story"
          : "Save story"}
      </button>

      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </form>
  );
}