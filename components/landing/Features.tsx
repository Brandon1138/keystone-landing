import { Activity, BarChart3, GitBranch, Terminal, Layers } from "lucide-react";

const FEATURES = [
  { Icon: Activity,    title: "Real-time benchmarking", body: "High-resolution metrics with live charts, percentiles, and throughput distributions." },
  { Icon: BarChart3,   title: "Visual analytics",       body: "Compare schemes at a glance with interactive dashboards and drill-down detail." },
  { Icon: GitBranch,   title: "Hybrid workflows",       body: "Model hybrid and composite cryptography with flexible workflow builders." },
  { Icon: Terminal,    title: "Desktop workbench",      body: "Run experiments locally with reproducible environments and offline confidence." },
  { Icon: Layers,      title: "Cross-platform",         body: "Native packages for macOS, Windows, and Linux. Consistent everywhere." },
];

export function Features() {
  return (
    <section id="features" className="container-page py-20 lg:py-28">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {FEATURES.map(({ Icon, title, body }) => (
          <article
            key={title}
            data-testid="feature-card"
            className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-border-strong"
          >
            <span className="grid h-9 w-9 place-items-center rounded-md border border-primary/40 bg-primary/10 text-primary">
              <Icon className="h-4 w-4" />
            </span>
            <h3 className="mt-4 text-[15px] font-semibold text-foreground">{title}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-foreground-muted">{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
