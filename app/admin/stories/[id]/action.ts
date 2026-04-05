"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function approveStory(formData: FormData) {
  const storyId = String(formData.get("storyId") || "");
  if (!storyId) {
    throw new Error("Missing story id");
  }

  const supabase = createSupabaseServerClient();

  const { error } = await supabase
    .from("stories")
    .update({
      editor_status: "approved",
      updated_at: new Date().toISOString(),
    })
    .eq("id", storyId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/admin/stories/${storyId}`);
  revalidatePath("/admin/stories");
  revalidatePath("/admin/news-queue");
}

export async function rejectStory(formData: FormData) {
  const storyId = String(formData.get("storyId") || "");
  if (!storyId) {
    throw new Error("Missing story id");
  }

  const supabase = createSupabaseServerClient();

  const { error } = await supabase
    .from("stories")
    .update({
      editor_status: "rejected",
      updated_at: new Date().toISOString(),
    })
    .eq("id", storyId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/admin/stories/${storyId}`);
  revalidatePath("/admin/stories");
  revalidatePath("/admin/news-queue");
}

export async function publishStory(formData: FormData) {
  const storyId = String(formData.get("storyId") || "");
  if (!storyId) {
    throw new Error("Missing story id");
  }

  const supabase = createSupabaseServerClient();
  const now = new Date().toISOString();

  const { error } = await supabase
    .from("stories")
    .update({
      status: "published",
      editor_status: "published",
      published_at: now,
      updated_at: now,
    })
    .eq("id", storyId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/admin/stories/${storyId}`);
  revalidatePath("/admin/stories");
  revalidatePath("/admin/news-queue");
  revalidatePath("/");
}

export async function moveToEditorReview(formData: FormData) {
  const storyId = String(formData.get("storyId") || "");
  if (!storyId) {
    throw new Error("Missing story id");
  }

  const supabase = createSupabaseServerClient();

  const { error } = await supabase
    .from("stories")
    .update({
      editor_status: "editor_review",
      updated_at: new Date().toISOString(),
    })
    .eq("id", storyId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/admin/stories/${storyId}`);
  revalidatePath("/admin/stories");
  revalidatePath("/admin/news-queue");
}