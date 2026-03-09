import Link from "next/link";
import { Container } from "@/components/common/Container";
import { getThemes } from "@/lib/queries";

export async function ThemeShortcutStrip() {
  const themes = await getThemes();

  if (!themes.length) return null;

  return (
    <section className="bg-slate-50 py-6">
      <Container>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
                Browse faster
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                Jump directly into a data theme
              </h2>
            </div>

            <Link
              href="/data"
              className="inline-flex h-fit items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              View all themes
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {themes.map((theme) => (
              <Link
                key={theme.id}
                href={`/themes/${theme.slug}`}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
              >
                {theme.name}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}