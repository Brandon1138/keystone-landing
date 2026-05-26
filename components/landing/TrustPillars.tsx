import Link from "next/link";
import { Github, RefreshCw, Lock, Grid3x3, EyeOff, ArrowRight } from "lucide-react";

const PILLARS = [
  { Icon: Github,    title: "Open & Auditable",     body: "Open source core with peer-reviewed code and transparent builds." },
  { Icon: RefreshCw, title: "Reproducible Runs",     body: "Deterministic toolchains, locked dependencies, and environment capture." },
  { Icon: Lock,      title: "Secure by Default",     body: "Memory-safe components, constant-time primitives, and side-channel aware." },
  { Icon: Grid3x3,   title: "Modular Architecture",  body: "Plugin system for schemes, runtimes, and custom experiment modules." },
  { Icon: EyeOff,    title: "Data Privacy",          body: "All runs stay on your machine. No telemetry. Ever." },
];

export function TrustPillars() {
  return (
    <section id="trust" className="container-page pb-20 lg:pb-28">
      <div className="rounded-2xl border border-border bg-surface p-6 lg:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_2.4fr] lg:items-start">
          <div>
            <h2 className="text-[clamp(28px,3.4vw,40px)] font-semibold leading-[1.05] tracking-tight text-foreground">
              Built on a foundation<br />you can trust.
            </h2>
            <p className="mt-3 max-w-[36ch] text-[15px] text-foreground-muted">
              Keystone is engineered for correctness, transparency, and reproducibility.
            </p>
            <Link
              href="/security/"
              className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-light"
            >
              Learn more about our security model <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {PILLARS.map(({ Icon, title, body }) => (
              <article
                key={title}
                data-testid="trust-card"
                className="rounded-xl border border-border bg-background p-4"
              >
                <span className="grid h-9 w-9 place-items-center rounded-md border border-primary/40 bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="mt-4 text-[13px] font-semibold text-foreground">{title}</h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-foreground-muted">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
