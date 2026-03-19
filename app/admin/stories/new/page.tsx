"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import StoryForm from "@/components/admin/StoryForm";

export default function NewStoryPage() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setChecking(false);
    }

    checkUser();
  }, [router, supabase]);

  if (checking) {
    return <main className="mx-auto max-w-5xl px-4 py-12">Checking login...</main>;
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-semibold">New story</h1>
      <p className="mt-3 text-slate-600">
        Create a draft, review it, and publish when ready.
      </p>

      <div className="mt-8">
        <StoryForm mode="create" />
      </div>
    </main>
  );
}