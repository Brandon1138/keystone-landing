import { LATENCY_GAUGE } from "@/lib/mockData";

export function LatencyGauge() {
  return (
    <div
      data-testid="mockup-gauge"
      className="flex flex-col rounded-lg border border-border bg-surface-2 p-4"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-[12px] font-semibold text-foreground">Median Latency (ms)</h4>
      </div>

      <div className="relative mx-auto mt-2 w-full max-w-[220px]">
        <svg viewBox="0 0 200 120" className="w-full">
          <defs>
            <linearGradient id="gaugeStroke" x1="0" x2="1">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-secondary)" />
            </linearGradient>
          </defs>
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#1E293B" strokeWidth="10" strokeLinecap="round" />
          <path d="M 20 100 A 80 80 0 0 1 75 33" fill="none" stroke="url(#gaugeStroke)" strokeWidth="10" strokeLinecap="round" />
          {[20, 50, 100, 150, 180].map((x, i) => (
            <line key={i} x1={x} x2={x} y1="106" y2="112" stroke="#475569" strokeWidth="1.5" />
          ))}
        </svg>
        <div className="absolute inset-x-0 bottom-2 flex flex-col items-center">
          <span className="text-3xl font-semibold tracking-tight text-foreground">{LATENCY_GAUGE.value}</span>
          <span className="text-[11px] text-foreground-subtle">{LATENCY_GAUGE.unit}</span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
        {(["p50", "p95", "p99"] as const).map((k) => (
          <div key={k}>
            <div className="text-[10px] uppercase tracking-wider text-foreground-subtle">{k.toUpperCase()}</div>
            <div className="text-[11px] font-medium text-foreground">{LATENCY_GAUGE[k]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
