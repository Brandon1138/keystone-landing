import { ArrowUp } from "lucide-react";
import { TOP_METRICS } from "@/lib/mockData";

export function MetricStrip() {
  return (
    <div data-testid="mockup-metrics" className="grid grid-cols-4 gap-3 border-b border-border p-4">
      {TOP_METRICS.map((m) => {
        const negative = m.delta.startsWith("-");
        return (
          <div
            key={m.label}
            data-testid="metric-card"
            className="rounded-lg border border-border bg-surface-2 px-4 py-3"
          >
            <div className="text-[11px] font-medium uppercase tracking-wider text-foreground-subtle">{m.label}</div>
            <div className="mt-1 flex items-baseline gap-2">
              <div className="text-xl font-semibold text-foreground">{m.value}</div>
              <span
                className={
                  negative
                    ? "text-[11px] font-medium text-danger"
                    : "inline-flex items-center gap-0.5 text-[11px] font-medium text-success"
                }
              >
                {!negative && <ArrowUp className="h-3 w-3" />}
                {m.delta}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
