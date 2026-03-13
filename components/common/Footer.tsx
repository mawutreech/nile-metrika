import Link from "next/link";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <Container>
        <div className="grid gap-10 py-14 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Nile Metrica</h3>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              South Sudan’s public portal for accessible, trusted, and structured
              statistical information.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-200">
              Explore
            </h4>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
              <Link href="/data">Data</Link>
              <Link href="/publications">Publications</Link>
              <Link href="/methodology">Methodology</Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-200">
              Institution
            </h4>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-200">
              Legal
            </h4>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
              <span>Terms of Use</span>
              <span>Privacy Policy</span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}