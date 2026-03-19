"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Props = {
  storyId: string;
  storyTitle: string;
};

export default function DeleteStoryButton({ storyId, storyTitle }: Props) {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${storyTitle}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setDeleting(true);

    const { error } = await supabase.from("stories").delete().eq("id", storyId);

    if (error) {
      alert(error.message);
      setDeleting(false);
      return;
    }

    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="text-red-600 hover:underline disabled:opacity-60"
    >
      {deleting ? "Deleting..." : "Delete"}
    </button>
  );
}