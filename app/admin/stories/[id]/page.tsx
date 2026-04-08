import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import StoryEditorPage from "./server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type StoryRecord = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body_html: string;
  featured_image_url: string | null;
  section: string;
  category: string | null;
  status: string;
  seo_title: string | null;
  seo_description: string | null;
};

export default async function AdminStoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createSupabaseServerClient();

  const { data: story, error } = await supabase
    .from("stories")
    .select(
      "id, title, slug, excerpt, body_html, featured_image_url, section, category, status, seo_title, seo_description"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Admin story detail query failed:", error);
  }

  if (!story) {
    notFound();
  }

  return <StoryEditorPage story={story as StoryRecord} />;
}