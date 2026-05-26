import Link from "next/link";
import { ArrowRight, Shield, RefreshCw, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

const PILLARS = [
  { Icon: Shield,    title: "Open Source",        body: "Apache 2.0" },
  { Icon: RefreshCw, title: "Reproducible",        body: "Deterministic runs" },
  { Icon: Terminal,  title: "Built for Engineers", body: "Not just dashboards" },
];

export function Hero({ mockup }: { mockup?: React.ReactNode }) {
  return (
    <section id="platform" className="relative overflow-hidden">
      <div
        aria-hidden
        className="glow-breathe pointer-events-none absolute -top-40 right-[-10%] h-[640px] w-[640px] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--color-primary) 28%, transparent), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-180px] right-[-160px] h-[420px] w-[420px] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--color-secondary) 24%, transparent), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[280px] opacity-50"
        style={{
          maskImage:
            "linear-gradient(to top right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 60%)",
          WebkitMaskImage:
            "linear-gradient(to top right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 60%)",
          backgroundImage:
            "radial-gradient(circle, rgba(148,163,184,0.18) 1px, transparent 1.5px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="container-page relative grid items-center gap-12 py-20 lg:grid-cols-[1fr_1.35fr] lg:gap-16 lg:py-28">
        <div className="reveal">
          <h1 className="text-balance text-[clamp(40px,5.2vw,72px)] font-bold leading-[1.04] tracking-[-0.035em] text-foreground">
            Post-Quantum<br />Benchmarking,<br />
            <span className="text-gradient">Made Observable.</span>
          </h1>

          <p className="mt-6 max-w-[44ch] text-[17px] leading-[1.65] text-foreground-muted">
            Keystone is a desktop workbench for benchmarking classical and
            post-quantum cryptography. Visualize performance, explore runtime
            trade-offs, and ship cryptography with confidence.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="#download">
                Download Keystone
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/reports/">
                View Case Study
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <ul className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            {PILLARS.map(({ Icon, title, body }) => (
              <li key={title} className="flex items-center gap-3 text-sm">
                <span className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-foreground-muted">
                  <span className="font-medium text-foreground">{title}</span>
                  <span className="mx-1.5 text-foreground-subtle">·</span>
                  {body}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">{mockup}</div>
      </div>
    </section>
  );
}
