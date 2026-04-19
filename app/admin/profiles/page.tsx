"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Author = {
  id: string;
  full_name: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  role: string | null;
  email: string | null;
};

type AuthorForm = {
  full_name: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  role: string;
  email: string;
};

const emptyForm: AuthorForm = {
  full_name: "",
  display_name: "",
  bio: "",
  avatar_url: "",
  role: "",
  email: "",
};

export default function AdminProfilesPage() {
  const supabase = createSupabaseBrowserClient();

  const [authors, setAuthors] = useState<Author[]>([]);
  const [form, setForm] = useState<AuthorForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  async function loadAuthors() {
    setLoading(true);

    const { data, error } = await supabase
      .from("authors")
      .select("id, full_name, display_name, bio, avatar_url, role, email")
      .order("display_name", { ascending: true });

    if (error) {
      setFeedback(error.message);
    } else {
      setAuthors(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadAuthors();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function startEdit(author: Author) {
    setEditingId(author.id);
    setForm({
      full_name: author.full_name ?? "",
      display_name: author.display_name ?? "",
      bio: author.bio ?? "",
      avatar_url: author.avatar_url ?? "",
      role: author.role ?? "",
      email: author.email ?? "",
    });
    setFeedback("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setFeedback("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFeedback("");

    try {
      const payload = {
        full_name: form.full_name.trim() || null,
        display_name: form.display_name.trim() || form.full_name.trim(),
        bio: form.bio.trim() || null,
        avatar_url: form.avatar_url.trim() || null,
        role: form.role.trim() || null,
        email: form.email.trim() || null,
      };

      if (!payload.display_name) {
        throw new Error("Display name or full name is required.");
      }

      if (editingId) {
        const { error } = await supabase
          .from("authors")
          .update(payload)
          .eq("id", editingId);

        if (error) throw error;
        setFeedback("Author updated.");
      } else {
        const { error } = await supabase.from("authors").insert(payload);
        if (error) throw error;
        setFeedback("Author created.");
      }

      resetForm();
      await loadAuthors();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1.4fr]">
        <section>
          <h1 className="text-4xl font-semibold tracking-tight text-[#2f2f2f]">
            Author profiles
          </h1>
          <p className="mt-3 text-base text-[#555]">
            Create and manage contributor profiles used in published stories.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#333]">
                Full name
              </label>
              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                className="w-full border border-[#d8d8d8] px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#333]">
                Display name
              </label>
              <input
                name="display_name"
                value={form.display_name}
                onChange={handleChange}
                className="w-full border border-[#d8d8d8] px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#333]">
                Role
              </label>
              <input
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border border-[#d8d8d8] px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#333]">
                Email
              </label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-[#d8d8d8] px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#333]">
                Avatar URL
              </label>
              <input
                name="avatar_url"
                value={form.avatar_url}
                onChange={handleChange}
                className="w-full border border-[#d8d8d8] px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#333]">
                Bio
              </label>
              <textarea
                name="bio"
                rows={5}
                value={form.bio}
                onChange={handleChange}
                className="w-full border border-[#d8d8d8] px-4 py-3 outline-none"
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#2f6e57] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : editingId ? "Update profile" : "Create profile"}
              </button>

              {editingId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-[#d8d8d8] px-6 py-3 text-sm font-medium text-[#333]"
                >
                  Cancel
                </button>
              ) : null}
            </div>

            {feedback ? <p className="text-sm text-[#555]">{feedback}</p> : null}
          </form>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#2f2f2f]">Existing authors</h2>

          {loading ? (
            <p className="mt-6 text-sm text-slate-500">Loading authors...</p>
          ) : authors.length === 0 ? (
            <div className="mt-6 border border-[#d8d8d8] bg-white p-5 text-sm text-slate-600">
              No author profiles yet.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {authors.map((author) => (
                <div
                  key={author.id}
                  className="flex items-start justify-between gap-4 border border-[#d8d8d8] bg-white p-5"
                >
                  <div className="flex gap-4">
                    {author.avatar_url ? (
                      <img
                        src={author.avatar_url}
                        alt={author.display_name ?? "Author"}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#dfe5ea] text-xl font-semibold text-[#334]">
                        {(author.display_name || author.full_name || "A")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-semibold text-[#2f2f2f]">
                        {author.display_name || author.full_name || "Unnamed author"}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {author.role || "Contributor"}
                      </p>
                      {author.email ? (
                        <p className="mt-1 text-sm text-slate-500">{author.email}</p>
                      ) : null}
                      {author.bio ? (
                        <p className="mt-2 max-w-2xl text-sm text-[#555]">{author.bio}</p>
                      ) : null}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => startEdit(author)}
                    className="text-sm font-medium text-[#2f6e57] hover:underline"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}