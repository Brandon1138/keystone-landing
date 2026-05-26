"use client";

import Link from "next/link";
import { Github, ArrowRight, Linkedin } from "lucide-react";

const COLUMNS = [
  { heading: "Product",   links: [["Features", "#features"], ["Benchmarks", "#comparison"], ["Workflows", "#features"], ["Download", "#download"]] },
  { heading: "Resources", links: [["Docs", "/docs/"], ["Case Studies", "/reports/"], ["Blog", "/blog/"], ["Security", "/security/"]] },
  { heading: "Community", links: [["GitHub", "#"], ["Discussions", "#"], ["Contributing", "#"], ["Security", "/security/"]] },
  { heading: "Company",   links: [["About", "/about/"], ["Contact", "/contact/"], ["Privacy", "/privacy/"], ["License", "/terms/"]] },
] as const;

function MastodonLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="currentColor" d="M21.6 7.6c0-4.4-2.9-5.7-2.9-5.7C17.3 1.3 14.7 1 12 1c-2.7 0-5.3.3-6.7.9 0 0-2.9 1.3-2.9 5.7v6.1c0 4.2 2.7 5.5 4.7 5.9 1 .2 1.8.3 2.4.3 1.1 0 1.9-.2 1.9-.2v-1.9s-1 .3-2.3.2c-1.3 0-2.7-.2-2.9-1.7.8.2 1.7.3 2.7.3 4 0 7.4-.8 7.4-3.6 0-3.4-.3-6-.7-6.4M16.9 14h-2.5V8.3c0-1.3-.6-1.9-1.7-1.9-1.3 0-1.9.8-1.9 2.4v3.5H8.4V8.8c0-1.6-.6-2.4-1.9-2.4-1.1 0-1.7.6-1.7 1.9V14H2.3V8.1c0-1.3.4-2.4 1.1-3.1.7-.7 1.6-1.1 2.7-1.1 1.3 0 2.3.5 2.9 1.5l.6 1 .6-1c.7-1 1.7-1.5 3-1.5 1.1 0 2 .4 2.7 1.1.7.7 1.1 1.8 1.1 3.1V14z" />
    </svg>
  );
}

export function Footer() {
  function onSubmit(e: React.FormEvent) { e.preventDefault(); }
  return (
    <footer role="contentinfo" className="border-t border-border bg-surface">
      <div className="container-page py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 lg:grid-cols-6">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2" aria-label="Keystone home">
              <span aria-hidden className="block h-7 w-7 rounded-md bg-gradient-to-br from-primary to-primary-light" />
              <span className="text-lg font-semibold tracking-tight text-foreground">Keystone</span>
            </Link>
            <p className="mt-4 text-[13px] text-foreground-muted">Post-Quantum Benchmarking,<br />Made Observable.</p>
            <ul className="mt-5 flex items-center gap-3">
              <li><Link href="#" aria-label="GitHub" className="text-foreground-muted hover:text-foreground"><Github className="h-4 w-4" /></Link></li>
              <li><Link href="#" aria-label="Mastodon" className="text-foreground-muted hover:text-foreground"><MastodonLogo className="h-4 w-4" /></Link></li>
              <li><Link href="#" aria-label="LinkedIn" className="text-foreground-muted hover:text-foreground"><Linkedin className="h-4 w-4" /></Link></li>
            </ul>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-[13px] font-semibold text-foreground">{col.heading}</h3>
              <ul className="mt-4 flex flex-col gap-2">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-[13px] text-foreground-muted transition-colors hover:text-foreground">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-1">
            <h3 className="text-[13px] font-semibold text-foreground">Stay in the loop</h3>
            <p className="mt-4 text-[13px] text-foreground-muted">Get updates on releases and research.</p>
            <form className="mt-3 flex items-center gap-2" onSubmit={onSubmit}>
              <label className="sr-only" htmlFor="footer-email">Email</label>
              <input
                id="footer-email"
                type="email"
                placeholder="you@company.com"
                className="h-9 flex-1 rounded-md border border-border bg-background px-3 text-[13px] text-foreground placeholder:text-foreground-subtle focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="grid h-9 w-9 place-items-center rounded-md bg-primary text-background hover:bg-primary-light"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-[12px] text-foreground-subtle sm:flex-row sm:items-center">
          <span>© 2026 Keystone Labs Inc. All rights reserved.</span>
          <span className="flex items-center gap-4">
            <Link href="/terms/" className="hover:text-foreground">Terms of Use</Link>
            <Link href="/privacy/" className="hover:text-foreground">Privacy Policy</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
