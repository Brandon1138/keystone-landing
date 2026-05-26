import { ArrowUp, ArrowDown, Shield, Gauge, Clock, Box } from "lucide-react";
import { COMPARISON } from "@/lib/mockData";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Security Level": Shield,
  "Throughput": Gauge,
  "Median Latency": Clock,
  "Artifact Size": Box,
};

export function ClassicalVsPqc() {
  return (
    <section id="comparison" className="container-page pb-20 lg:pb-28">
      <div className="rounded-2xl border border-border bg-surface p-6 lg:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_2fr] lg:items-end">
          <div>
            <h2 className="text-[clamp(28px,3.4vw,40px)] font-semibold leading-[1.05] tracking-tight text-foreground">
              Classical vs Post-Quantum
            </h2>
            <p className="mt-3 text-[15px] text-foreground-muted">See the trade-offs. Choose with confidence.</p>

            <ul className="mt-6 flex flex-col gap-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                <span className="text-foreground-muted">{COMPARISON.legend.pqc}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-secondary" />
                <span className="text-foreground-muted">{COMPARISON.legend.classical}</span>
              </li>
            </ul>

            <ul className="mt-6 flex flex-col gap-2 text-[13px] text-foreground-subtle">
              <li className="inline-flex items-center gap-1.5"><ArrowUp className="h-3.5 w-3.5" /> Higher is better</li>
              <li className="inline-flex items-center gap-1.5"><ArrowDown className="h-3.5 w-3.5" /> Lower is better</li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {COMPARISON.metrics.map((m) => {
              const Icon = ICONS[m.label];
              return (
                <article
                  key={m.label}
                  data-testid="comparison-chart"
                  className="flex flex-col rounded-xl border border-border bg-background p-4"
                >
                  <div className="flex items-center gap-2">
                    {Icon && (
                      <span className="grid h-7 w-7 place-items-center rounded-md border border-border bg-surface text-primary">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                    )}
                    <div>
                      <div className="text-[13px] font-semibold text-foreground">{m.label}</div>
                      <div className="text-[10px] uppercase tracking-wider text-foreground-subtle">{m.unit}</div>
                    </div>
                  </div>

                  <div className="mt-5 grid h-[120px] grid-cols-2 items-end gap-2">
                    <Bar value={m.pqc.value} height={m.pqc.height} color="var(--color-primary)" />
                    <Bar value={m.classical.value} height={m.classical.height} color="var(--color-secondary)" />
                  </div>

                  <div className="mt-2 grid grid-cols-2 text-center text-[10px] text-foreground-muted">
                    <span>PQC (Avg)</span>
                    <span>Classical (Avg)</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <p className="mt-6 text-center text-[12px] text-foreground-subtle">
          Results vary by scheme, parameters, and platform. Benchmark responsibly.
        </p>
      </div>
    </section>
  );
}

function Bar({ value, height, color }: { value: string; height: number; color: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-end">
      <span className="mb-1 text-[11px] font-medium text-foreground">{value}</span>
      <span
        className="w-full rounded-t-md"
        style={{ height: `${height}%`, background: `linear-gradient(180deg, ${color}, color-mix(in oklab, ${color} 70%, transparent))` }}
      />
    </div>
  );
}
