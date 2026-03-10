"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-semibold text-slate-900">Admin login</h1>
      <p className="mt-3 text-slate-600">
        Sign in to manage publications, datasets, and indicators.
      </p>

      <form onSubmit={handleLogin} className="mt-8 space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3"
        />
        <button
          type="submit"
          className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-medium text-white"
        >
          Sign in
        </button>
      </form>

      {message ? <p className="mt-4 text-sm text-rose-600">{message}</p> : null}
    </main>
  );
}