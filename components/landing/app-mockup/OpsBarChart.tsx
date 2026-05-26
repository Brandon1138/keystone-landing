import { OPS_BARS } from "@/lib/mockData";

export function OpsBarChart() {
  return (
    <div
      data-testid="mockup-ops-chart"
      className="flex flex-col gap-3 rounded-lg border border-border bg-surface-2 p-4"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-[12px] font-semibold text-foreground">Operations / second</h4>
        <span className="text-[10px] text-foreground-subtle">(higher is better)</span>
      </div>

      <ul className="flex flex-col gap-1.5">
        {OPS_BARS.map((row) => (
          <li
            key={row.label}
            data-testid="ops-bar"
            className="grid grid-cols-[72px_1fr_56px] items-center gap-3"
          >
            <span className="text-[11px] text-foreground-muted">{row.label}</span>
            <span className="h-2 rounded-full bg-surface-3">
              <span
                className="block h-full rounded-full"
                style={{
                  width: `${row.width}%`,
                  background: "linear-gradient(90deg, var(--color-primary), var(--color-primary-light))",
                }}
              />
            </span>
            <span className="text-right text-[11px] font-medium text-foreground">{row.value}</span>
          </li>
        ))}
      </ul>

      <div className="mt-2 flex justify-between border-t border-border pt-2 text-[10px] text-foreground-subtle">
        <span>0</span><span>2M</span><span>4M</span><span>6M</span><span>8M</span>
      </div>
    </div>
  );
}
