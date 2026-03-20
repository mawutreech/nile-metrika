"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/admin/stories");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Login</h1>
      <p className="mt-3 text-slate-600">
        Sign in to manage stories and editorial content.
      </p>

      <form onSubmit={handleLogin} className="mt-8 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Email address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full border border-slate-300 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border border-slate-300 px-4 py-3"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-700 px-5 py-3 font-medium text-white disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {message ? <p className="mt-4 text-sm text-red-600">{message}</p> : null}
    </main>
  );
}