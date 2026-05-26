import { HISTOGRAM_BINS } from "@/lib/mockData";

export function ThroughputHistogram() {
  return (
    <div
      data-testid="mockup-histogram"
      className="flex flex-col rounded-lg border border-border bg-surface-2 p-4"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-[12px] font-semibold text-foreground">Throughput Distribution (ops/s)</h4>
      </div>

      <div className="mt-3 flex h-[120px] items-end gap-[3px]">
        {HISTOGRAM_BINS.map((value, idx) => (
          <span
            key={idx}
            data-testid="histogram-bar"
            className="flex-1 rounded-sm"
            style={{
              height: `${value}%`,
              background: "linear-gradient(180deg, var(--color-primary-light), var(--color-secondary))",
              opacity: 0.85,
            }}
          />
        ))}
      </div>

      <div className="mt-2 flex justify-between border-t border-border pt-2 text-[10px] text-foreground-subtle">
        <span>10k</span><span>100k</span><span>1M</span><span>10M</span><span>100M</span>
      </div>
    </div>
  );
}
