import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { Container } from "@/components/common/Container";

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact"
        description="Get in touch for data requests, feedback, corrections, or partnership inquiries."
      />
      <section className="py-12">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="nm-card p-6">
              <h2 className="text-xl font-semibold text-slate-900">Contact details</h2>
              <div className="mt-4 space-y-2 text-slate-600">
                <p>Email: info@nilemetrika.org</p>
                <p>Data requests: data@nilemetrika.org</p>
                <p>Partnerships: partnerships@nilemetrika.org</p>
              </div>
            </div>
            <div className="nm-card p-6">
              <h2 className="text-xl font-semibold text-slate-900">Contact form</h2>
              <div className="mt-4 grid gap-4">
                <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Your name" />
                <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Email address" />
                <textarea className="min-h-32 rounded-xl border border-slate-200 px-4 py-3" placeholder="Message" />
                <button className="nm-button-primary w-fit">Send message</button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Nile Metrika for data requests, corrections, feedback, and partnership inquiries.",
};