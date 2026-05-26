import { LATENCY_SERIES } from "@/lib/mockData";

const W = 480;
const H = 160;
const PADDING = 24;

function toPolyline(points: readonly number[]): string {
  const usableW = W - PADDING * 2;
  const usableH = H - PADDING * 2;
  return points
    .map((y, i) => {
      const x = PADDING + (i / (points.length - 1)) * usableW;
      const yPx = PADDING + (y / 100) * usableH;
      return `${x.toFixed(1)},${yPx.toFixed(1)}`;
    })
    .join(" ");
}

export function LatencyLineChart() {
  return (
    <div
      data-testid="mockup-line-chart"
      className="flex flex-col rounded-lg border border-border bg-surface-2 p-4"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-[12px] font-semibold text-foreground">Latency Over Time (ms)</h4>
        <span className="text-[10px] text-foreground-subtle">Window: 60s · Aggregation: P50</span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 w-full" role="img" aria-label="Latency over time">
        {[0.25, 0.5, 0.75].map((t) => (
          <line
            key={t}
            x1={PADDING}
            x2={W - PADDING}
            y1={PADDING + t * (H - PADDING * 2)}
            y2={PADDING + t * (H - PADDING * 2)}
            stroke="#1E293B"
            strokeDasharray="2 4"
          />
        ))}
        {LATENCY_SERIES.map((s) => (
          <polyline
            key={s.name}
            points={toPolyline(s.points)}
            fill="none"
            stroke={s.color}
            strokeWidth="1.6"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}
        <g fontFamily="var(--font-mono)" fontSize="9" fill="#64748B">
          <text x={PADDING} y={H - 6}>-60s</text>
          <text x={W * 0.25} y={H - 6} textAnchor="middle">-45s</text>
          <text x={W * 0.5} y={H - 6} textAnchor="middle">-30s</text>
          <text x={W * 0.75} y={H - 6} textAnchor="middle">-15s</text>
          <text x={W - PADDING} y={H - 6} textAnchor="end">Now</text>
        </g>
      </svg>

      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-foreground-muted">
        {LATENCY_SERIES.map((s) => (
          <li key={s.name} className="flex items-center gap-1.5">
            <span className="h-1.5 w-3 rounded-full" style={{ background: s.color }} />
            {s.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
