"use client";

import { useEffect, useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        setStatus("idle");
        setFeedback("");
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [status]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setFeedback("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to send message.");
      }

      setStatus("success");
      setFeedback("Your message has been sent.");
      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof Error ? error.message : "Something went wrong."
      );
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="border border-[#d8d8d8] bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3f7f68]">
            Contact
          </p>

          <h1 className="mt-3 text-4xl font-semibold text-[#2f2f2f]">
            Get in touch
          </h1>

          <p className="mt-4 text-base leading-8 text-[#555]">
            For editorial inquiries, corrections, partnerships, and general
            questions, contact Nile Metrica.
          </p>

          <div className="mt-8 space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                General email
              </p>
              <a
                href="mailto:info@nilemetrica.com"
                className="mt-2 inline-block text-lg font-medium text-[#2f6e57] hover:underline"
              >
                info@nilemetrica.com
              </a>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                Editorial
              </p>
              <p className="mt-2 text-[#333]">
                Use the form to send a message directly to the editorial inbox.
              </p>
            </div>
          </div>
        </section>

        <section className="border border-[#d8d8d8] bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3f7f68]">
            Send a message
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#333]">
                Name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) =>
                  setForm((current) => ({ ...current, name: e.target.value }))
                }
                className="w-full border border-[#d8d8d8] px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#333]">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm((current) => ({ ...current, email: e.target.value }))
                }
                className="w-full border border-[#d8d8d8] px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#333]">
                Subject
              </label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    subject: e.target.value,
                  }))
                }
                className="w-full border border-[#d8d8d8] px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#333]">
                Message
              </label>
              <textarea
                required
                rows={8}
                value={form.message}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    message: e.target.value,
                  }))
                }
                className="w-full border border-[#d8d8d8] px-4 py-3 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="bg-[#2f6e57] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {status === "sending" ? "Sending..." : "Send message"}
            </button>

            {feedback ? (
              <p
                className={`text-sm ${
                  status === "success" ? "text-green-700" : "text-red-600"
                }`}
              >
                {feedback}
              </p>
            ) : null}
          </form>
        </section>
      </div>
    </main>
  );
}