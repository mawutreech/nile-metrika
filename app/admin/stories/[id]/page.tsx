import { notFound } from "next/navigation";
import StoryForm from "@/components/admin/StoryForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditStoryPage({ params }: Props) {
  const { id } = await params;
  const supabase = createSupabaseServerClient();

  const { data: story, error } = await supabase
    .from("stories")
    .select(
      "id, title, slug, excerpt, body_html, featured_image_url, section, category, status, seo_title, seo_description"
    )
    .eq("id", id)
    .single();

  if (error || !story) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Edit story</h1>
      <p className="mt-3 text-slate-600">
        Update the story and save your changes.
      </p>

      <div className="mt-8">
        <StoryForm mode="edit" initialData={story} />
      </div>
    </main>
  );
}