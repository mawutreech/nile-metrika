import { PublicPageIntro } from "@/components/site/PublicPageIntro";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
      <PublicPageIntro
        eyebrow="Contact"
        title="Get in touch"
        description="Use this page for portal feedback, data questions, or general communication related to Nile Metrica."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-slate-900">General enquiries</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            For general questions about the portal, datasets, indicators, or
            publications, use your preferred public contact channel here.
          </p>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-slate-900">Feedback</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Feedback on missing data, broken links, metadata issues, or general
            usability improvements is especially helpful as the portal grows.
          </p>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-2">
          <h2 className="text-xl font-semibold text-slate-900">Contact details</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Add your official email address, web contact details, or office
            information here when ready.
          </p>
        </section>
      </div>
    </main>
  );
}