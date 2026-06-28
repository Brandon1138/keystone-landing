"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";

import {
  AddIcon,
  AddTaskIcon,
  AssessmentIcon,
  BarChartIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  CodeIcon,
  CodexIcon,
  CompareIcon,
  ComputerIcon,
  ContentCopyIcon,
  CreateIcon,
  DarkModeIcon,
  DashboardIcon,
  DeleteIcon,
  EncryptionIcon,
  ExploreIcon,
  HistoryIcon,
  ImportIcon,
  InfoIcon,
  InsightsIcon,
  LaunchIcon,
  LibraryBooksIcon,
  LightModeIcon,
  LinkIcon,
  LockIcon,
  LockOpenIcon,
  MemoryIcon,
  PaletteIcon,
  PlayArrowIcon,
  PlaylistPlayIcon,
  QuantumIcon,
  RadioCheckedIcon,
  RefreshIcon,
  RestoreIcon,
  SaveIcon,
  ScheduleIcon,
  SchoolIcon,
  SearchIcon,
  SecurityIcon,
  SettingsIcon,
  ShowChartIcon,
  SpeedIcon,
  SwapHorizIcon,
  TerminalIcon,
  TuneIcon,
  VerifiedIcon,
  ViewListIcon,
  VisibilityIcon,
  VisibilityOffIcon,
  VisualizeIcon,
  VpnKeyIcon,
} from "./AppIcons";

const SYSTEM_THEME_QUERY = "(prefers-color-scheme: dark)";

type IconCmp = ComponentType<{ className?: string }>;
type DemoThemePreference = "light" | "dark" | "system";
type Route =
  | "dashboard"
  | "benchmarks"
  | "visualize"
  | "job-history"
  | "quantum"
  | "encryption"
  | "schedule"
  | "codex"
  | "import"
  | "settings";
type RunStatus = "completed" | "failed" | "running";

/* The real app's nav. `route` is set only for the screens this demo
   reproduces; the rest render in place but stay inert, just like a
   read-only tour of the shell. Mirrors keystone/App.tsx NAV_GROUPS. */
const NAV_GROUPS: {
  label: string;
  items: { text: string; Icon: IconCmp; route?: Route }[];
}[] = [
  {
    label: "Execute",
    items: [
      { text: "Quantum Workloads", Icon: QuantumIcon, route: "quantum" },
      { text: "Benchmarks", Icon: SpeedIcon, route: "benchmarks" },
      { text: "Encryption", Icon: EncryptionIcon, route: "encryption" },
      { text: "Schedule Jobs", Icon: ScheduleIcon, route: "schedule" },
    ],
  },
  {
    label: "Analyze",
    items: [
      { text: "Dashboard", Icon: DashboardIcon, route: "dashboard" },
      { text: "Visualize", Icon: VisualizeIcon, route: "visualize" },
      { text: "Codex", Icon: CodexIcon, route: "codex" },
      { text: "Job History", Icon: HistoryIcon, route: "job-history" },
    ],
  },
  {
    label: "Manage",
    items: [
      { text: "Import", Icon: ImportIcon, route: "import" },
      { text: "Settings", Icon: SettingsIcon, route: "settings" },
    ],
  },
];

const ROUTE_TITLE: Record<Route, string> = {
  dashboard: "Dashboard",
  benchmarks: "Benchmarks",
  visualize: "Visualize",
  "job-history": "Job History",
  quantum: "Quantum Workloads",
  encryption: "Encryption Operations",
  schedule: "Schedule Jobs",
  codex: "Cryptographic Codex",
  import: "Import",
  settings: "Settings",
};

/* ── Status primitive (mirrors instrument-primitives StatusBadge) ────── */

const STATUS_BG: Record<string, string> = {
  completed: "var(--status-success)",
  success: "var(--status-success)",
  failed: "var(--status-error)",
  error: "var(--status-error)",
  running: "var(--status-running)",
  idle: "var(--status-idle)",
};

function StatusBadge({
  status,
  label,
}: {
  status: keyof typeof STATUS_BG;
  label: string;
}) {
  const Icon =
    status === "completed" || status === "success"
      ? CheckGlyph
      : status === "failed" || status === "error"
        ? CrossGlyph
        : status === "running"
          ? RadioCheckedIcon
          : ScheduleIcon;
  return (
    <span className="ks-badge" style={{ background: STATUS_BG[status] }}>
      <Icon className="ks-badge-icon" />
      {label}
    </span>
  );
}

function CheckGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8z" />
    </svg>
  );
}
function CrossGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m1 15h-2v-2h2zm0-4h-2V7h2z" />
    </svg>
  );
}

function statusDot(status: string) {
  return STATUS_BG[status] ?? "var(--status-idle)";
}

function getSitePrefersDark(systemTheme: MediaQueryList) {
  const explicit = document.documentElement.getAttribute("data-theme");
  return explicit === "dark" || (explicit !== "light" && systemTheme.matches);
}

/* ── Panel head shared by every screen ───────────────────────────────── */

function PanelHead({
  Icon,
  title,
  sub,
  action,
}: {
  Icon: IconCmp;
  title: string;
  sub?: string;
  action?: ReactNode;
}) {
  return (
    <div className="ks-panel-head">
      <div className="ks-panel-title">
        <Icon className="ks-panel-title-icon" />
        <h3>{title}</h3>
        {sub && <span className="ks-panel-sub">{sub}</span>}
      </div>
      {action}
    </div>
  );
}

/* ── Dashboard ───────────────────────────────────────────────────────── */

const READOUTS = [
  { label: "Total runs", value: "1,284", unit: "", caption: "All time" },
  { label: "Success rate", value: "94", unit: "%", caption: "1,207 of 1,284 finished runs" },
  { label: "Peak throughput", value: "1.2M", unit: "ops/s", caption: "ML-KEM-768 · encaps" },
  { label: "Best latency", value: "6", unit: "µs", caption: "ML-KEM-768 · encaps" },
];

// 14 days of seeded run counts: completed / failed / pending.
const ACTIVITY: [number, number, number][] = [
  [3, 0, 0], [5, 1, 0], [2, 0, 0], [7, 0, 1], [4, 1, 0], [9, 0, 0], [6, 0, 0],
  [0, 0, 0], [8, 1, 0], [11, 0, 0], [5, 0, 1], [7, 2, 0], [10, 0, 0], [6, 1, 0],
];

const ALGO_MIX = [
  { name: "ML-KEM (kyber)", share: 41 },
  { name: "ML-DSA (dilithium)", share: 22 },
  { name: "Falcon", share: 14 },
  { name: "SPHINCS+", share: 9 },
  { name: "AES", share: 8 },
  { name: "Other", share: 6, residual: true },
];

const RECENT = [
  { name: "ML-KEM", variant: "768", type: "PQC", iter: "10,000", status: "completed", time: "4m ago" },
  { name: "ML-DSA", variant: "65", type: "PQC", iter: "1,000", status: "completed", time: "22m ago" },
  { name: "Falcon", variant: "1024", type: "PQC", iter: "1,000", status: "failed", time: "1h ago" },
  { name: "Shor", variant: "N=15", type: "Shor", iter: "—", status: "completed", time: "3h ago" },
  { name: "SPHINCS+", variant: "SHAKE", type: "PQC", iter: "100", status: "completed", time: "5h ago" },
  { name: "AES", variant: "256", type: "PQC", iter: "10,000", status: "completed", time: "Jun 23" },
];

function ActivityChart() {
  const w = 640;
  const h = 190;
  const gap = 10;
  const barW = (w - gap * (ACTIVITY.length - 1)) / ACTIVITY.length;
  const max = Math.max(...ACTIVITY.map(([c, f, o]) => c + f + o), 1);
  const scale = (n: number) => (n / max) * (h - 16);

  return (
    <svg className="ks-chart" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden>
      {[0.25, 0.5, 0.75].map((g) => (
        <line
          key={g}
          x1="0"
          y1={h * g}
          x2={w}
          y2={h * g}
          stroke="var(--app-border-soft)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          strokeDasharray="3 5"
        />
      ))}
      {ACTIVITY.map(([c, f, o], i) => {
        const x = i * (barW + gap);
        const ch = scale(c);
        const fh = scale(f);
        const oh = scale(o);
        const total = ch + fh + oh;
        return (
          <g key={i}>
            {total === 0 && (
              <rect x={x} y={h - 2} width={barW} height={2} fill="var(--app-border-soft)" />
            )}
            {oh > 0 && (
              <rect x={x} y={h - total} width={barW} height={oh} fill="var(--status-idle)" opacity={0.55} />
            )}
            {fh > 0 && (
              <rect x={x} y={h - ch - fh} width={barW} height={fh} fill="var(--status-error)" />
            )}
            {ch > 0 && (
              <rect x={x} y={h - ch} width={barW} height={ch} fill="var(--app-primary)" />
            )}
          </g>
        );
      })}
    </svg>
  );
}

function DashboardScreen({ today, onRun }: { today: string; onRun: () => void }) {
  return (
    <div className="ks-stack">
      <header className="ks-page-head">
        <div>
          <span className="ks-eyebrow">{today || " "}</span>
          <h1>Dashboard</h1>
        </div>
        <button type="button" className="ks-cta" onClick={onRun}>
          <PlayArrowIcon className="ks-cta-icon" />
          Run Benchmark
        </button>
      </header>

      <section className="ks-card ks-readout" aria-label="Key metrics">
        {READOUTS.map((r) => (
          <div key={r.label} className="ks-readout-seg">
            <span className="ks-readout-label">{r.label}</span>
            <div className="ks-readout-value mono">
              {r.value}
              {r.unit && <span className="ks-readout-unit">{r.unit}</span>}
            </div>
            <span className="ks-readout-caption">{r.caption}</span>
          </div>
        ))}
      </section>

      <section className="ks-dash-main">
        <div className="ks-card ks-panel ks-chart-panel">
          <PanelHead
            Icon={InsightsIcon}
            title="Activity"
            sub="Runs per day · last 14 days"
            action={
              <div className="ks-legend">
                <span className="ks-legend-item">
                  <i className="ks-swatch is-completed" />
                  Completed
                </span>
                <span className="ks-legend-item">
                  <i className="ks-swatch is-failed" />
                  Failed
                </span>
                <span className="ks-legend-item">
                  <i className="ks-swatch is-muted" />
                  Pending
                </span>
              </div>
            }
          />
          <ActivityChart />
          <div className="ks-chart-axis">
            <span>Jun 11</span>
            <span>Jun 18</span>
            <span>Today</span>
          </div>
        </div>

        <div className="ks-dash-side">
          <div className="ks-card ks-panel">
            <PanelHead Icon={BarChartIcon} title="Algorithm mix" />
            <div className="ks-mix">
              {ALGO_MIX.map((a) => (
                <div key={a.name} className="ks-mix-row">
                  <span className={`ks-mix-name${a.residual ? " is-residual" : ""}`}>{a.name}</span>
                  <span className="ks-mix-track">
                    <span
                      className={`ks-mix-fill${a.residual ? " is-residual" : ""}`}
                      style={{ width: `${a.share}%` }}
                    />
                  </span>
                  <span className="ks-mix-share mono">{a.share}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ks-card ks-panel">
            <PanelHead Icon={MemoryIcon} title="Environment" />
            <dl className="ks-env">
              <div className="ks-env-row">
                <dt>Evidence store</dt>
                <dd>
                  <span className="ks-dot" style={{ background: "var(--status-success)" }} />
                  1,284 runs
                </dd>
              </div>
              <div className="ks-env-row">
                <dt>Benchmark results</dt>
                <dd className="mono">642</dd>
              </div>
              <div className="ks-env-row">
                <dt>Last run</dt>
                <dd className="mono">4m ago</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="ks-card ks-panel">
        <PanelHead
          Icon={HistoryIcon}
          title="Recent activity"
          action={
            <span className="ks-link">
              View all
              <ChevronRightIcon className="ks-link-icon" />
            </span>
          }
        />
        <ul className="ks-runs">
          {RECENT.map((run) => (
            <li key={`${run.name}-${run.time}`} className="ks-run">
              <span className="ks-dot" style={{ background: statusDot(run.status) }} />
              <span className="ks-run-name">
                {run.name}
                <span className="ks-run-variant mono">{run.variant}</span>
              </span>
              <span className="ks-run-meta">{run.type}</span>
              <span className="ks-run-meta mono">{run.iter === "—" ? "—" : `${run.iter} iter`}</span>
              <span className="ks-run-meta">
                {run.status.charAt(0).toUpperCase() + run.status.slice(1)}
              </span>
              <span className="ks-run-time mono">{run.time}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/* ── Benchmarks (live simulation) ────────────────────────────────────── */

const ALGORITHMS: { value: string; label: string; params: string[]; iters: number }[] = [
  { value: "kyber", label: "ML-KEM (Kyber)", params: ["512", "768", "1024"], iters: 10000 },
  { value: "dilithium", label: "ML-DSA (Dilithium)", params: ["44", "65", "87"], iters: 1000 },
  { value: "falcon", label: "Falcon", params: ["512", "1024"], iters: 1000 },
  { value: "sphincs", label: "SPHINCS+", params: ["SHA2", "SHAKE"], iters: 100 },
  { value: "aes", label: "AES", params: ["128", "192", "256"], iters: 10000 },
  { value: "rsa", label: "RSA", params: ["2048", "3072", "4096"], iters: 100 },
  { value: "ecdsa", label: "ECDSA", params: ["P-256", "P-384"], iters: 1000 },
];

const PHASES = ["Key generation", "Encapsulation", "Decapsulation", "Verification"];

function BenchmarksScreen() {
  const [algo, setAlgo] = useState(ALGORITHMS[0]);
  const [param, setParam] = useState(ALGORITHMS[0].params[1]);
  const [iterations, setIterations] = useState(ALGORITHMS[0].iters);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("Ready");
  const [perf, setPerf] = useState({ avg: "0", min: "0", max: "0" });
  const [sys, setSys] = useState({ tput: "0", avg: "0", peak: "0" });
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  const pickAlgo = (value: string) => {
    const next = ALGORITHMS.find((a) => a.value === value) ?? ALGORITHMS[0];
    setAlgo(next);
    setParam(next.params[Math.min(1, next.params.length - 1)]);
    setIterations(next.iters);
    setDone(false);
    setPhase("Ready");
    setProgress(0);
  };

  const run = () => {
    if (running) return;
    if (timer.current) clearInterval(timer.current);
    setRunning(true);
    setDone(false);
    setProgress(0);
    setPhase("Initializing");
    let p = 0;
    timer.current = setInterval(() => {
      p += 4 + Math.random() * 6;
      const clamped = Math.min(p, 100);
      setProgress(clamped);
      setPhase(PHASES[Math.min(PHASES.length - 1, Math.floor((clamped / 100) * PHASES.length))]);
      const jitter = (base: number) => (base * (0.9 + Math.random() * 0.2)).toFixed(6);
      setPerf({ avg: jitter(0.006), min: jitter(0.0054), max: jitter(0.0089) });
      setSys({
        tput: (165000 * (0.9 + Math.random() * 0.2)).toFixed(2),
        avg: (12.4 * (0.9 + Math.random() * 0.2)).toFixed(2),
        peak: (48.2 * (0.9 + Math.random() * 0.2)).toFixed(2),
      });
      if (clamped >= 100) {
        if (timer.current) clearInterval(timer.current);
        setRunning(false);
        setDone(true);
        setPhase("Completed");
        setPerf({ avg: "0.006012", min: "0.005418", max: "0.008934" });
        setSys({ tput: "166335.71", avg: "12.41", peak: "48.20" });
      }
    }, 180);
  };

  return (
    <div className="ks-stack">
      <header className="ks-page-head">
        <div>
          <h1>Benchmarks</h1>
          <p>PQC and classical cryptographic algorithm performance benchmarking</p>
        </div>
        <StatusBadge
          status={running ? "running" : done ? "success" : "idle"}
          label={running ? phase : done ? "Completed" : "Ready"}
        />
      </header>

      <section className="ks-card ks-panel">
        <PanelHead Icon={SpeedIcon} title="Configuration" />
        <div className="ks-field-grid">
          <label className="ks-field">
            <span>Algorithm</span>
            <select value={algo.value} onChange={(e) => pickAlgo(e.target.value)} disabled={running}>
              {ALGORITHMS.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </label>
          <label className="ks-field">
            <span>Security Parameter</span>
            <select value={param} onChange={(e) => setParam(e.target.value)} disabled={running}>
              {algo.params.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label className="ks-field">
            <span>Iterations</span>
            <input
              type="number"
              value={iterations}
              min={1}
              step={1000}
              disabled={running}
              onChange={(e) => setIterations(Math.max(1, Number(e.target.value) || 1))}
            />
          </label>
        </div>
        <div className="ks-run-row">
          <button type="button" className="ks-cta" onClick={run} disabled={running}>
            {running ? <span className="ks-spinner" /> : <PlayArrowIcon className="ks-cta-icon" />}
            {running ? "Running…" : "Run Benchmark"}
          </button>
          {(running || done) && (
            <span className="ks-run-tag mono">
              {algo.label} / {param} / {iterations.toLocaleString()} iter
            </span>
          )}
        </div>
        <div className="ks-progress" aria-hidden>
          <span style={{ width: `${running ? progress : done ? 100 : 0}%`, opacity: running || done ? 1 : 0 }} />
        </div>
      </section>

      <div className="ks-metric-grid">
        <div className="ks-card ks-panel">
          <PanelHead Icon={AssessmentIcon} title="Performance" />
          <dl className="ks-readout-list">
            <Readout label="Avg Time" value={perf.avg} unit="ms" />
            <Readout label="Min Time" value={perf.min} unit="ms" />
            <Readout label="Max Time" value={perf.max} unit="ms" />
          </dl>
        </div>
        <div className="ks-card ks-panel ks-progress-card">
          <PanelHead Icon={RadioCheckedIcon} title="Progress" />
          <div className="ks-progress-readout">
            <span className="ks-progress-pct mono">{Math.round(running ? progress : done ? 100 : 0)}%</span>
            <span className="ks-progress-phase">{phase}</span>
          </div>
          <div className="ks-progress big" aria-hidden>
            <span style={{ width: `${running ? progress : done ? 100 : 0}%` }} />
          </div>
        </div>
        <div className="ks-card ks-panel">
          <PanelHead Icon={ComputerIcon} title="System" />
          <dl className="ks-readout-list">
            <Readout label="Throughput" value={sys.tput} unit="ops/s" />
            <Readout label="ΔRSS Avg" value={sys.avg} unit="KB" />
            <Readout label="ΔRSS Peak" value={sys.peak} unit="KB" />
          </dl>
        </div>
      </div>
    </div>
  );
}

function Readout({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="ks-readout-pair">
      <span className="ks-readout-pair-label">{label}</span>
      <span className="ks-readout-pair-value mono">
        {value}
        <span className="ks-readout-pair-unit">{unit}</span>
      </span>
    </div>
  );
}

/* ── Visualize ───────────────────────────────────────────────────────── */

const CHART_TYPES = [
  { value: "avg", label: "Average Time", Icon: BarChartIcon },
  { value: "ops", label: "Operations/Sec", Icon: BarChartIcon },
  { value: "mem", label: "Memory Usage", Icon: ShowChartIcon },
  { value: "compare", label: "Compare", Icon: CompareIcon },
];

const VIZ_BARS: Record<string, { name: string; value: number; alt?: boolean }[]> = {
  avg: [
    { name: "ML-KEM", value: 0.006 },
    { name: "Falcon", value: 0.0108 },
    { name: "ML-DSA", value: 0.0157 },
    { name: "SPHINCS+", value: 0.5033 },
    { name: "RSA", value: 1.84, alt: true },
    { name: "ECDSA", value: 0.21, alt: true },
  ],
  ops: [
    { name: "ML-KEM", value: 166000 },
    { name: "Falcon", value: 92000 },
    { name: "ML-DSA", value: 63000 },
    { name: "SPHINCS+", value: 1980 },
    { name: "RSA", value: 540, alt: true },
    { name: "ECDSA", value: 4700, alt: true },
  ],
  compare: [
    { name: "ML-KEM", value: 166000 },
    { name: "RSA-2048", value: 540, alt: true },
    { name: "ML-DSA", value: 63000 },
    { name: "ECDSA", value: 4700, alt: true },
    { name: "Falcon", value: 92000 },
    { name: "AES-256", value: 240000, alt: true },
  ],
};

const MEM_LINE = [18, 22, 19, 26, 24, 31, 28, 35, 33, 40, 38, 44];

function VizChart({ type }: { type: string }) {
  if (type === "mem") {
    const w = 640;
    const h = 220;
    const max = Math.max(...MEM_LINE) * 1.15;
    const step = w / (MEM_LINE.length - 1);
    const pts = MEM_LINE.map((v, i) => [i * step, h - (v / max) * (h - 24)]);
    const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
    const area = `${d} L${w} ${h} L0 ${h} Z`;
    return (
      <svg className="ks-viz-chart" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden>
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1="0" y1={h * g} x2={w} y2={h * g} stroke="var(--app-border-soft)" strokeWidth="1" vectorEffect="non-scaling-stroke" strokeDasharray="3 5" />
        ))}
        <path d={area} fill="var(--app-primary)" opacity={0.1} />
        <path d={d} fill="none" stroke="var(--app-primary)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill="var(--app-primary)" />
        ))}
      </svg>
    );
  }

  const bars = VIZ_BARS[type] ?? VIZ_BARS.avg;
  const max = Math.max(...bars.map((b) => b.value));
  return (
    <div className="ks-viz-bars">
      {bars.map((b) => (
        <div key={b.name} className="ks-viz-bar-col">
          <span
            className={`ks-viz-bar${b.alt ? " is-alt" : ""}`}
            style={{ height: `${Math.max(4, (b.value / max) * 100)}%` }}
          />
          <span className="ks-viz-bar-label">{b.name}</span>
        </div>
      ))}
    </div>
  );
}

function VisualizeScreen() {
  const [chart, setChart] = useState("avg");
  const [source, setSource] = useState("benchmarks");
  const [range, setRange] = useState("week");

  return (
    <div className="ks-stack">
      <header className="ks-page-head">
        <div>
          <h1>Visualize</h1>
          <p>Explore benchmark and quantum workload results across runs.</p>
        </div>
      </header>

      <section className="ks-card ks-panel">
        <PanelHead
          Icon={VisualizeIcon}
          title="Data selection"
          action={
            <button type="button" className="ks-ghost-btn">
              <RefreshIcon className="ks-ghost-icon" />
              Refresh Data
            </button>
          }
        />
        <div className="ks-field-grid">
          <label className="ks-field">
            <span>Data Source</span>
            <select value={source} onChange={(e) => setSource(e.target.value)}>
              <option value="benchmarks">Benchmark Results</option>
              <option value="quantum">Quantum Workloads</option>
            </select>
          </label>
          <label className="ks-field">
            <span>Algorithm</span>
            <select defaultValue="all">
              <option value="all">All Algorithms</option>
              <option value="kyber">ML-KEM (Kyber)</option>
              <option value="dilithium">ML-DSA (Dilithium)</option>
              <option value="falcon">Falcon</option>
              <option value="rsa">RSA</option>
            </select>
          </label>
          <label className="ks-field">
            <span>Time Range</span>
            <select value={range} onChange={(e) => setRange(e.target.value)}>
              <option value="day">Last 24 Hours</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="all">All Time</option>
            </select>
          </label>
        </div>
        <div className="ks-seg">
          {CHART_TYPES.map((c) => (
            <button
              key={c.value}
              type="button"
              className={`ks-seg-btn${chart === c.value ? " is-active" : ""}`}
              onClick={() => setChart(c.value)}
            >
              <c.Icon className="ks-seg-icon" />
              {c.label}
            </button>
          ))}
        </div>
      </section>

      <section className="ks-card ks-panel ks-viz-panel">
        <PanelHead
          Icon={CHART_TYPES.find((c) => c.value === chart)?.Icon ?? BarChartIcon}
          title={CHART_TYPES.find((c) => c.value === chart)?.label ?? "Average Time"}
          sub={chart === "ops" ? "operations per second" : chart === "mem" ? "peak RSS, KB" : chart === "avg" ? "avg ms per op" : "PQC vs classical"}
        />
        <VizChart type={chart} />
      </section>
    </div>
  );
}

/* ── Job History ─────────────────────────────────────────────────────── */

const JOB_ROWS = [
  { algo: "ML-KEM (Kyber)", kind: "pqc", type: "PQC", security: "768", iter: "10,000", status: "completed", date: "Jun 24, 2:59 AM" },
  { algo: "ML-DSA (Dilithium)", kind: "pqc", type: "PQC", security: "65", iter: "1,000", status: "completed", date: "Jun 24, 2:31 AM" },
  { algo: "Falcon", kind: "pqc", type: "PQC", security: "1024", iter: "1,000", status: "failed", date: "Jun 23, 11:48 PM" },
  { algo: "Shor's Algorithm", kind: "quantum", type: "Shor", security: "N=15", iter: "—", status: "completed", date: "Jun 23, 9:12 PM" },
  { algo: "SPHINCS+", kind: "pqc", type: "PQC", security: "SHAKE", iter: "100", status: "completed", date: "Jun 23, 6:04 PM" },
  { algo: "Grover's Algorithm", kind: "quantum", type: "Grover", security: "5 qubit", iter: "—", status: "running", date: "Jun 23, 5:20 PM" },
  { algo: "AES", kind: "pqc", type: "PQC", security: "256", iter: "10,000", status: "completed", date: "Jun 23, 1:37 PM" },
  { algo: "RSA", kind: "pqc", type: "PQC", security: "2048", iter: "100", status: "failed", date: "Jun 22, 8:55 PM" },
];

const JOB_TABS = [
  { value: "all", label: "All" },
  { value: "quantum", label: "Quantum Workloads" },
  { value: "pqc", label: "PQC Benchmarks" },
];

function JobHistoryScreen() {
  const [tab, setTab] = useState("all");
  const rows = JOB_ROWS.filter((r) => tab === "all" || r.kind === tab);

  return (
    <div className="ks-stack">
      <header className="ks-page-head">
        <div>
          <h1>Job History</h1>
          <p>
            View and manage the history of previously executed jobs and benchmarks.
            Track performance over time, compare results, and identify trends.
          </p>
        </div>
      </header>

      <section className="ks-card ks-panel">
        <PanelHead
          Icon={HistoryIcon}
          title="Runs & filters"
          action={
            <button type="button" className="ks-icon-btn" aria-label="Refresh">
              <RefreshIcon className="ks-ghost-icon" />
            </button>
          }
        />
        <div className="ks-filter-row">
          <div className="ks-tabs">
            {JOB_TABS.map((t) => (
              <button
                key={t.value}
                type="button"
                className={`ks-tab${tab === t.value ? " is-active" : ""}`}
                onClick={() => setTab(t.value)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <span className="ks-search">
            <SearchIcon className="ks-search-icon" />
            <span className="ks-search-ph">Search algorithms, IDs…</span>
          </span>
        </div>
        <table className="ks-table">
          <thead>
            <tr>
              <th>Algorithm</th>
              <th>Type</th>
              <th>Security</th>
              <th>Iterations</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.algo}-${r.date}`}>
                <td className="ks-td-strong">{r.algo}</td>
                <td>{r.type}</td>
                <td className="mono">{r.security}</td>
                <td className="mono">{r.iter}</td>
                <td>
                  <span className="ks-chip" style={{ color: statusDot(r.status) }}>
                    <span className="ks-dot" style={{ background: statusDot(r.status) }} />
                    {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                  </span>
                </td>
                <td className="ks-td-muted mono">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

/* ── Shared row primitives ───────────────────────────────────────────── */

function DataRow({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  color?: string;
}) {
  return (
    <div className="ks-readout-pair">
      <span className="ks-readout-pair-label">{label}</span>
      <span
        className="ks-readout-pair-value mono"
        style={color ? { color } : undefined}
      >
        {value}
        {unit && <span className="ks-readout-pair-unit">{unit}</span>}
      </span>
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      className="ks-switch"
      role="switch"
      aria-checked={on}
      onClick={onChange}
    >
      <span className={`ks-toggle-track${on ? " is-on" : ""}`} aria-hidden />
    </button>
  );
}

function LogTerminal({ lines }: { lines: string[] }) {
  return (
    <div className="ks-log mono">
      {lines.length > 0 ? (
        lines.map((l, i) => (
          <div key={i} className="ks-log-line">
            <span className="ks-log-prompt">›</span>
            {l}
          </div>
        ))
      ) : (
        <span className="ks-log-empty">No output yet. Run a workload.</span>
      )}
    </div>
  );
}

function DistChart({ bars }: { bars: { state: string; v: number }[] }) {
  const max = Math.max(...bars.map((b) => b.v), 0.0001);
  return (
    <div className="ks-viz-bars" style={{ height: 180 }}>
      {bars.map((b) => (
        <div key={b.state} className="ks-viz-bar-col">
          <span
            className={`ks-viz-bar${b.v / max < 0.25 ? " is-alt" : ""}`}
            style={{ height: `${Math.max(4, (b.v / max) * 100)}%` }}
          />
          <span className="ks-viz-bar-label mono">{b.state}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Quantum Workloads (live simulation) ─────────────────────────────── */

const SHOR_LOGS = [
  "Initializing quantum simulator (aer_simulator)…",
  "Building period-finding circuit for N=15, a=7…",
  "Transpiling circuit (optimization_level=3)…",
  "Post-transpile depth 18, 42 gates (12 CX)…",
  "Executing 4,096 shots…",
  "Measuring phase register, continued-fraction expansion…",
  "Recovered period r=4, gcd(7^2 ± 1, 15)…",
  "Factors found: 3 × 5. Workload complete.",
];

const GROVER_LOGS = [
  "Initializing quantum simulator (aer_simulator)…",
  "Encoding oracle for marked states 101, 010…",
  "Applying 2 Grover iterations across 3 qubits…",
  "Transpiling circuit (optimization_level=3)…",
  "Post-transpile depth 24, 58 gates (18 CX)…",
  "Executing 8,192 shots…",
  "Amplifying marked amplitudes…",
  "Top measured state 101 (count 3,962). Workload complete.",
];

const SHOR_DIST = [
  { state: "0000", v: 0.26 },
  { state: "0100", v: 0.24 },
  { state: "1000", v: 0.25 },
  { state: "1100", v: 0.25 },
];

const GROVER_DIST = [
  { state: "000", v: 0.04 },
  { state: "010", v: 0.46 },
  { state: "011", v: 0.03 },
  { state: "101", v: 0.44 },
  { state: "111", v: 0.03 },
];

function QuantumScreen() {
  const [algorithm, setAlgorithm] = useState<"shors" | "grovers">("shors");
  const [marked, setMarked] = useState("101,010");
  const [shots, setShots] = useState(4096);
  const [backend, setBackend] = useState("least_busy");
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("Ready");
  const [logs, setLogs] = useState<string[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  const pickAlgo = (value: string) => {
    const next = value === "grovers" ? "grovers" : "shors";
    setAlgorithm(next);
    setShots(next === "shors" ? 4096 : 8192);
    setDone(false);
    setLogs([]);
    setProgress(0);
    setPhase("Ready");
  };

  const run = () => {
    if (running) return;
    if (timer.current) clearInterval(timer.current);
    const script = algorithm === "shors" ? SHOR_LOGS : GROVER_LOGS;
    setRunning(true);
    setDone(false);
    setProgress(0);
    setLogs([]);
    setPhase("Initializing quantum simulator");
    let p = 0;
    let shown = 0;
    timer.current = setInterval(() => {
      p += 5 + Math.random() * 7;
      const clamped = Math.min(p, 100);
      setProgress(clamped);
      const target = Math.min(script.length, Math.ceil((clamped / 100) * script.length));
      if (target > shown) {
        shown = target;
        setLogs(script.slice(0, shown));
        setPhase(script[shown - 1]);
      }
      if (clamped >= 100) {
        if (timer.current) clearInterval(timer.current);
        setLogs(script);
        setRunning(false);
        setDone(true);
        setPhase("Completed");
      }
    }, 260);
  };

  const isShor = algorithm === "shors";
  const dist = isShor ? SHOR_DIST : GROVER_DIST;

  return (
    <div className="ks-stack">
      <header className="ks-page-head">
        <div>
          <h1>Quantum Workloads</h1>
          <p>
            Execute Shor&apos;s and Grover&apos;s algorithms on IBM Quantum and
            Google Cirq platforms.
          </p>
        </div>
        <StatusBadge
          status={running ? "running" : done ? "success" : "idle"}
          label={running ? "Running" : done ? "Success" : "Idle"}
        />
      </header>

      <section className="ks-card ks-panel">
        <PanelHead Icon={QuantumIcon} title="Configuration" />
        <div className="ks-field-grid">
          <label className="ks-field">
            <span>Algorithm</span>
            <select
              value={algorithm}
              onChange={(e) => pickAlgo(e.target.value)}
              disabled={running}
            >
              <option value="shors">Shor&apos;s Algorithm</option>
              <option value="grovers">Grover&apos;s Algorithm</option>
            </select>
          </label>
          {isShor ? (
            <label className="ks-field">
              <span>N-value</span>
              <input value="15" disabled readOnly />
            </label>
          ) : (
            <label className="ks-field">
              <span>Marked States</span>
              <input
                value={marked}
                onChange={(e) => setMarked(e.target.value)}
                disabled={running}
                placeholder="e.g. 101,010"
              />
            </label>
          )}
          <label className="ks-field">
            <span>Shots</span>
            <input
              type="number"
              value={shots}
              min={1}
              step={1024}
              disabled={running}
              onChange={(e) => setShots(Math.max(1, Number(e.target.value) || 1))}
            />
          </label>
        </div>
        <div className="ks-field-grid-2">
          <label className="ks-field">
            <span>Backend</span>
            <select
              value={backend}
              onChange={(e) => setBackend(e.target.value)}
              disabled={running}
            >
              <option value="least_busy">Least Busy</option>
              <option value="ibm_sherbrooke">IBM Sherbrooke</option>
              <option value="ibm_brisbane">IBM Brisbane</option>
              <option value="ibm_quebec">IBM Quebec</option>
            </select>
          </label>
          <label className="ks-field">
            <span>IBM Quantum API Token</span>
            <input value="••••••••••••••••" disabled readOnly />
          </label>
        </div>
        <div className="ks-run-row">
          <button type="button" className="ks-cta" onClick={run} disabled={running}>
            {running ? <span className="ks-spinner" /> : <PlayArrowIcon className="ks-cta-icon" />}
            {running ? "Running…" : "Simulate"}
          </button>
          <button
            type="button"
            className="ks-btn-outline"
            disabled
            title="Requires an IBM Quantum API token in the desktop app"
          >
            Run on IBM Q
          </button>
          {(running || done) && (
            <span className="ks-run-tag mono">
              {isShor ? "Shor / N=15" : `Grover / ${marked}`} / {shots.toLocaleString()} shots
            </span>
          )}
        </div>
        <div className="ks-progress" aria-hidden>
          <span style={{ width: `${running ? progress : done ? 100 : 0}%`, opacity: running || done ? 1 : 0 }} />
        </div>
      </section>

      <div className="ks-metric-grid">
        <div className="ks-card ks-panel">
          <PanelHead Icon={AssessmentIcon} title="Simulation Result" />
          <dl className="ks-readout-list">
            {isShor ? (
              <DataRow label="Factors" value="3 × 5" color="var(--status-success)" />
            ) : (
              <>
                <DataRow label="Marked States" value={marked} />
                <DataRow label="Top State Count" value="3,962" />
              </>
            )}
            <DataRow label="Exec Time" value={isShor ? "2.34" : "3.18"} unit="s" />
            <DataRow label="Circuit Depth" value={isShor ? "18" : "24"} />
            <DataRow label="Gate Count" value={isShor ? "42" : "58"} />
            <DataRow label="Backend" value="aer_simulator" />
            <DataRow label="Job ID" value={isShor ? "sim_a1b2c3d4e5" : "sim_f6a7b8c9d0"} />
          </dl>
        </div>
        <div className="ks-card ks-panel">
          <PanelHead Icon={TerminalIcon} title="Execution Log" />
          <LogTerminal lines={logs} />
        </div>
        <div className="ks-card ks-panel">
          <PanelHead Icon={AssessmentIcon} title="Distribution" sub={done ? "measured" : "expected"} />
          <DistChart bars={dist} />
        </div>
      </div>
    </div>
  );
}

/* ── Encryption Operations ───────────────────────────────────────────── */

type EncKeys = { kemPk: string; sigPk: string; kemSk: string; sigSk: string } | null;
type EncPkg = {
  kemCt: string;
  iv: string;
  aesCt: string;
  sig: string;
  salt: string;
  ptSize: number;
} | null;

const KEM_PARAMS: Record<string, { pk: number; sk: number; ct: number }> = {
  "512": { pk: 800, sk: 1632, ct: 768 },
  "768": { pk: 1184, sk: 2400, ct: 1088 },
  "1024": { pk: 1568, sk: 3168, ct: 1568 },
};
const SIG_PARAMS: Record<string, { pk: number; sk: number; sig: number }> = {
  "2": { pk: 1312, sk: 2528, sig: 2420 },
  "3": { pk: 1952, sk: 4000, sig: 3293 },
  "5": { pk: 2592, sk: 4864, sig: 4595 },
};

// Deterministic-looking base64 sample for seeded key/ciphertext material.
function sampleB64(seed: number) {
  const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let s = "";
  let x = seed * 2654435761;
  for (let i = 0; i < 30; i++) {
    x = (x * 1103515245 + 12345) & 0x7fffffff;
    s += alpha[x % 64];
  }
  return s;
}

function EncKeyRow({
  label,
  bytes,
  seed,
  secret,
  visible,
  onToggle,
}: {
  label: string;
  bytes: number;
  seed: number;
  secret?: boolean;
  visible?: boolean;
  onToggle?: () => void;
}) {
  const b64 = sampleB64(seed);
  const display = secret && !visible ? "•".repeat(28) : `${b64}…`;
  return (
    <div className="ks-key-row">
      <span className="ks-key-label">
        {label}
        <span className="ks-key-bytes mono"> ({bytes.toLocaleString()} B)</span>
      </span>
      <span className="ks-key-val mono">{display}</span>
      {secret && onToggle && (
        <button type="button" className="ks-icon-btn ks-key-btn" onClick={onToggle} aria-label="Toggle visibility">
          {visible ? <VisibilityOffIcon className="ks-ghost-icon" /> : <VisibilityIcon className="ks-ghost-icon" />}
        </button>
      )}
      <span className="ks-icon-btn ks-key-btn" aria-hidden>
        <ContentCopyIcon className="ks-ghost-icon" />
      </span>
    </div>
  );
}

function EncryptionScreen() {
  const [kemLevel, setKemLevel] = useState("512");
  const [sigLevel, setSigLevel] = useState("2");
  const [keys, setKeys] = useState<EncKeys>(null);
  const [showKemSk, setShowKemSk] = useState(false);
  const [showSigSk, setShowSigSk] = useState(false);
  const [plaintext, setPlaintext] = useState("");
  const [pkg, setPkg] = useState<EncPkg>(null);
  const [verified, setVerified] = useState<"idle" | "valid">("idle");
  const [decrypted, setDecrypted] = useState("");

  const km = KEM_PARAMS[kemLevel];
  const sg = SIG_PARAMS[sigLevel];

  const generate = () => {
    setKeys({ kemPk: "k", sigPk: "k", kemSk: "k", sigSk: "k" });
    setPkg(null);
    setVerified("idle");
    setDecrypted("");
  };

  const encrypt = () => {
    if (!keys || !plaintext) return;
    const ptSize = new TextEncoder().encode(plaintext).length;
    setPkg({
      kemCt: sampleB64(11),
      iv: sampleB64(12).slice(0, 16),
      aesCt: sampleB64(13),
      sig: sampleB64(14),
      salt: sampleB64(15).slice(0, 22),
      ptSize,
    });
    setVerified("idle");
    setDecrypted("");
  };

  const decrypt = () => {
    if (!pkg) return;
    setVerified("valid");
    setDecrypted(plaintext);
  };

  const pkgTotal = pkg ? km.ct + 12 + (pkg.ptSize + 16) + sg.sig + 16 : 0;

  return (
    <div className="ks-stack">
      <header className="ks-page-head">
        <div>
          <h1>Encryption Operations</h1>
          <p>
            ML-KEM (Kyber) key exchange, AES-256-GCM encryption, and ML-DSA
            (Dilithium) signing.
          </p>
        </div>
      </header>

      <section className="ks-card ks-panel">
        <PanelHead Icon={EncryptionIcon} title="Parameters" />
        <div className="ks-field-grid">
          <label className="ks-field">
            <span>ML-KEM Level</span>
            <select value={kemLevel} onChange={(e) => setKemLevel(e.target.value)}>
              <option value="512">512 (Level 1)</option>
              <option value="768">768 (Level 3)</option>
              <option value="1024">1024 (Level 5)</option>
            </select>
          </label>
          <label className="ks-field">
            <span>ML-DSA Level</span>
            <select value={sigLevel} onChange={(e) => setSigLevel(e.target.value)}>
              <option value="2">2 (Level 2)</option>
              <option value="3">3 (Level 3)</option>
              <option value="5">5 (Level 5)</option>
            </select>
          </label>
          <div className="ks-field ks-field-action">
            <span>&nbsp;</span>
            <button type="button" className="ks-cta ks-cta-block" onClick={generate}>
              <VpnKeyIcon className="ks-cta-icon" />
              Generate Keys
            </button>
          </div>
        </div>
      </section>

      <div className="ks-grid-2">
        <div className="ks-card ks-panel">
          <PanelHead Icon={CreateIcon} title="Public Keys" />
          {keys ? (
            <div className="ks-key-list">
              <EncKeyRow label="Public Key (ML-KEM)" bytes={km.pk} seed={1} />
              <EncKeyRow label="Public Key (ML-DSA)" bytes={sg.pk} seed={2} />
            </div>
          ) : (
            <p className="ks-empty">Generate keys to populate key material.</p>
          )}
        </div>
        <div className="ks-card ks-panel">
          <PanelHead Icon={VerifiedIcon} title="Secret Keys" />
          {keys ? (
            <div className="ks-key-list">
              <EncKeyRow
                label="Secret Key (ML-KEM)"
                bytes={km.sk}
                seed={3}
                secret
                visible={showKemSk}
                onToggle={() => setShowKemSk((v) => !v)}
              />
              <EncKeyRow
                label="Secret Key (ML-DSA)"
                bytes={sg.sk}
                seed={4}
                secret
                visible={showSigSk}
                onToggle={() => setShowSigSk((v) => !v)}
              />
            </div>
          ) : (
            <p className="ks-empty">Generate keys to populate key material.</p>
          )}
        </div>
      </div>

      <div className="ks-grid-2">
        <div className="ks-card ks-panel">
          <PanelHead Icon={LockIcon} title="1 · Encrypt & Sign" />
          <label className="ks-field">
            <span>Plaintext</span>
            <textarea
              className="ks-textarea mono"
              rows={3}
              value={plaintext}
              onChange={(e) => setPlaintext(e.target.value)}
              placeholder="Type a message to encrypt…"
            />
          </label>
          <button
            type="button"
            className="ks-cta ks-cta-block"
            style={{ marginTop: 12 }}
            onClick={encrypt}
            disabled={!keys || !plaintext}
          >
            <LockIcon className="ks-cta-icon" />
            Encrypt &amp; Sign
          </button>
          {pkg && (
            <dl className="ks-readout-list" style={{ marginTop: 14 }}>
              <DataRow label="KEM Ciphertext" value={`${pkg.kemCt}…`} />
              <DataRow label="AES IV" value={pkg.iv} />
              <DataRow label="AES Ciphertext+Tag" value={`${pkg.aesCt}…`} />
              <DataRow label="ML-DSA Signature" value={`${pkg.sig}…`} />
              <DataRow label="HKDF Salt" value={pkg.salt} />
              <DataRow label="Package Size" value={pkgTotal.toLocaleString()} unit="B" />
            </dl>
          )}
        </div>
        <div className="ks-card ks-panel">
          <PanelHead
            Icon={LockOpenIcon}
            title="2 · Decrypt & Verify"
            action={verified === "valid" ? <StatusBadge status="success" label="Signature Valid" /> : undefined}
          />
          <button
            type="button"
            className="ks-cta ks-cta-block"
            onClick={decrypt}
            disabled={!pkg}
          >
            <LockOpenIcon className="ks-cta-icon" />
            Decrypt &amp; Verify
          </button>
          <label className="ks-field" style={{ marginTop: 12 }}>
            <span>Decrypted Output</span>
            <textarea
              className="ks-textarea mono"
              rows={3}
              value={decrypted}
              readOnly
              placeholder="Decryption output appears here…"
            />
          </label>
          {verified === "valid" && (
            <dl className="ks-readout-list" style={{ marginTop: 14 }}>
              <DataRow label="Signature" value="ML-DSA verified" color="var(--status-success)" />
              <DataRow label="Security" value={`ML-KEM ${kemLevel} / ML-DSA ${sigLevel}`} />
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Schedule Jobs ───────────────────────────────────────────────────── */

const SCHED_ALGOS = [
  { value: "kyber", label: "ML-KEM (Kyber)", params: ["512", "768", "1024"] },
  { value: "dilithium", label: "ML-DSA (Dilithium)", params: ["44", "65", "87"] },
  { value: "falcon", label: "Falcon", params: ["512", "1024"] },
  { value: "sphincs", label: "SPHINCS+", params: ["SHA2", "SHAKE"] },
  { value: "mceliece", label: "Classic McEliece", params: ["348864", "460896"] },
  { value: "rsa", label: "RSA", params: ["2048", "3072", "4096"] },
  { value: "aes", label: "AES", params: ["128", "192", "256"] },
];

type SchedJob = {
  id: number;
  kind: string;
  algo: string;
  params: string;
  status: string;
  scheduled: string;
  created: string;
};

const SEED_JOBS: SchedJob[] = [
  { id: 1, kind: "BENCH", algo: "KYBER", params: "768, 10,000 iter", status: "running", scheduled: "Immediate", created: "2m ago" },
  { id: 2, kind: "QUANTUM", algo: "SHOR", params: "4,096 shots, simulation", status: "pending", scheduled: "in 1h", created: "5m ago" },
  { id: 3, kind: "BENCH", algo: "DILITHIUM", params: "65, 1,000 iter", status: "completed", scheduled: "Immediate", created: "1h ago" },
  { id: 4, kind: "BENCH", algo: "FALCON", params: "1024, 1,000 iter", status: "failed", scheduled: "Immediate", created: "2h ago" },
  { id: 5, kind: "QUANTUM", algo: "GROVER", params: "8,192 shots, 101,010", status: "completed", scheduled: "Immediate", created: "3h ago" },
];

function ScheduleScreen() {
  const [jobType, setJobType] = useState<"benchmark" | "quantum">("benchmark");
  const [algo, setAlgo] = useState(SCHED_ALGOS[0]);
  const [param, setParam] = useState(SCHED_ALGOS[0].params[1]);
  const [iterations, setIterations] = useState(10000);
  const [runs, setRuns] = useState(1);
  const [qAlgo, setQAlgo] = useState<"shor" | "grover">("shor");
  const [target, setTarget] = useState("simulation");
  const [shots, setShots] = useState(4096);
  const [jobs, setJobs] = useState<SchedJob[]>(SEED_JOBS);
  const nextId = useRef(SEED_JOBS.length + 1);

  const pickAlgo = (value: string) => {
    const next = SCHED_ALGOS.find((a) => a.value === value) ?? SCHED_ALGOS[0];
    setAlgo(next);
    setParam(next.params[Math.min(1, next.params.length - 1)]);
  };

  const addJob = () => {
    const job: SchedJob =
      jobType === "benchmark"
        ? {
            id: nextId.current++,
            kind: "BENCH",
            algo: algo.value.toUpperCase(),
            params: `${param}, ${iterations.toLocaleString()} iter`,
            status: "pending",
            scheduled: "Immediate",
            created: "just now",
          }
        : {
            id: nextId.current++,
            kind: "QUANTUM",
            algo: qAlgo.toUpperCase(),
            params: `${shots.toLocaleString()} shots, ${target}`,
            status: "pending",
            scheduled: "Immediate",
            created: "just now",
          };
    setJobs((prev) => [job, ...prev]);
  };

  return (
    <div className="ks-stack">
      <header className="ks-page-head">
        <div>
          <h1>Schedule Jobs</h1>
          <p>
            Queue benchmark and quantum workloads for sequential or scheduled
            execution.
          </p>
        </div>
      </header>

      <section className="ks-card ks-panel">
        <PanelHead Icon={ScheduleIcon} title="New Job" />
        <div className="ks-seg ks-seg-start">
          <button
            type="button"
            className={`ks-seg-btn${jobType === "benchmark" ? " is-active" : ""}`}
            onClick={() => setJobType("benchmark")}
          >
            <SpeedIcon className="ks-seg-icon" />
            Benchmark
          </button>
          <button
            type="button"
            className={`ks-seg-btn${jobType === "quantum" ? " is-active" : ""}`}
            onClick={() => setJobType("quantum")}
          >
            <QuantumIcon className="ks-seg-icon" />
            Quantum Workload
          </button>
        </div>

        {jobType === "benchmark" ? (
          <div className="ks-field-grid-2" style={{ marginTop: 14 }}>
            <label className="ks-field">
              <span>Algorithm</span>
              <select value={algo.value} onChange={(e) => pickAlgo(e.target.value)}>
                {SCHED_ALGOS.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="ks-field">
              <span>Security Parameter</span>
              <select value={param} onChange={(e) => setParam(e.target.value)}>
                {algo.params.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
            <label className="ks-field">
              <span>Iterations</span>
              <input
                type="number"
                value={iterations}
                min={1}
                step={1000}
                onChange={(e) => setIterations(Math.max(1, Number(e.target.value) || 1))}
              />
            </label>
            <label className="ks-field">
              <span>Number of Runs</span>
              <input
                type="number"
                value={runs}
                min={1}
                onChange={(e) => setRuns(Math.max(1, Number(e.target.value) || 1))}
              />
            </label>
          </div>
        ) : (
          <div className="ks-field-grid" style={{ marginTop: 14 }}>
            <label className="ks-field">
              <span>Algorithm</span>
              <select value={qAlgo} onChange={(e) => setQAlgo(e.target.value as "shor" | "grover")}>
                <option value="shor">Shor&apos;s Algorithm (N=15)</option>
                <option value="grover">Grover&apos;s Search</option>
              </select>
            </label>
            <label className="ks-field">
              <span>Execution Target</span>
              <select value={target} onChange={(e) => setTarget(e.target.value)}>
                <option value="simulation">Simulation</option>
                <option value="real_hardware">IBM Quantum Hardware</option>
              </select>
            </label>
            <label className="ks-field">
              <span>Shot Count</span>
              <input
                type="number"
                value={shots}
                min={1}
                step={1024}
                onChange={(e) => setShots(Math.max(1, Number(e.target.value) || 1))}
              />
            </label>
          </div>
        )}

        <div className="ks-run-row">
          <button type="button" className="ks-cta" onClick={addJob}>
            <AddTaskIcon className="ks-cta-icon" />
            Add to Queue
          </button>
          <button type="button" className="ks-btn-outline">
            <PlaylistPlayIcon className="ks-ghost-icon" />
            {jobType === "benchmark" ? "Batch Benchmarks" : "Batch Quantum"}
          </button>
        </div>
      </section>

      <section className="ks-card ks-panel">
        <PanelHead
          Icon={ViewListIcon}
          title="Job Queue"
          sub={`${jobs.length} jobs`}
          action={
            <button type="button" className="ks-icon-btn" aria-label="Refresh">
              <RefreshIcon className="ks-ghost-icon" />
            </button>
          }
        />
        <table className="ks-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Algorithm</th>
              <th>Parameters</th>
              <th>Status</th>
              <th>Scheduled</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.id}>
                <td className="mono ks-td-muted">{j.kind}</td>
                <td className="ks-td-strong">{j.algo}</td>
                <td className="mono ks-td-muted">{j.params}</td>
                <td>
                  <span className="ks-chip" style={{ color: statusDot(j.status) }}>
                    <span className="ks-dot" style={{ background: statusDot(j.status) }} />
                    {j.status.charAt(0).toUpperCase() + j.status.slice(1)}
                  </span>
                </td>
                <td className="ks-td-muted">{j.scheduled}</td>
                <td className="ks-td-muted mono">{j.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

/* ── Cryptographic Codex ─────────────────────────────────────────────── */

const CODEX_TABS: { value: string; label: string; Icon: IconCmp }[] = [
  { value: "standardization", label: "Standards", Icon: SettingsIcon },
  { value: "libraries", label: "Libraries", Icon: CodeIcon },
  { value: "quantum", label: "Frameworks", Icon: SchoolIcon },
  { value: "knowledge", label: "Knowledge", Icon: LibraryBooksIcon },
  { value: "frontiers", label: "Frontiers", Icon: ExploreIcon },
];

type CodexLink = { title: string; url: string; desc: string };
const CODEX_SECTIONS: Record<
  string,
  { title: string; Icon: IconCmp; groups: { title: string; links: CodexLink[] }[] }
> = {
  standardization: {
    title: "PQC Standardization & Guidance",
    Icon: SettingsIcon,
    groups: [
      {
        title: "NIST PQC Standardization",
        links: [
          { title: "NIST PQC Project", url: "csrc.nist.gov", desc: "Official NIST Post-Quantum Cryptography project page" },
          { title: "CRYSTALS-Kyber (ML-KEM)", url: "FIPS 203", desc: "Module-Lattice-Based Key-Encapsulation Mechanism Standard" },
          { title: "CRYSTALS-Dilithium (ML-DSA)", url: "FIPS 204", desc: "Module-Lattice-Based Digital Signature Standard" },
          { title: "SPHINCS+ (SLH-DSA)", url: "FIPS 205", desc: "Stateless Hash-Based Digital Signature Standard" },
        ],
      },
      {
        title: "Other Standards Bodies",
        links: [
          { title: "ETSI Quantum-Safe Cryptography", url: "etsi.org", desc: "ETSI Quantum-Safe Cryptography Technical Committee" },
          { title: "IETF Crypto Forum Research Group", url: "datatracker.ietf.org", desc: "IETF research group focused on cryptographic protocols" },
        ],
      },
    ],
  },
  libraries: {
    title: "PQC Libraries, Implementations & Tools",
    Icon: CodeIcon,
    groups: [
      {
        title: "Open Quantum Safe (OQS)",
        links: [
          { title: "liboqs", url: "github.com/open-quantum-safe", desc: "C library for quantum-resistant cryptographic algorithms" },
          { title: "OQS-OpenSSL", url: "github.com/open-quantum-safe", desc: "Integration of liboqs with OpenSSL" },
        ],
      },
      {
        title: "PQClean & Benchmarking",
        links: [
          { title: "PQClean", url: "github.com/PQClean", desc: "Clean, portable, tested PQC implementations" },
          { title: "SUPERCOP", url: "bench.cr.yp.to", desc: "Unified performance evaluation of cryptographic primitives" },
        ],
      },
    ],
  },
  quantum: {
    title: "Quantum Computing Frameworks & Platforms",
    Icon: SchoolIcon,
    groups: [
      {
        title: "IBM Quantum",
        links: [
          { title: "IBM Quantum", url: "quantum-computing.ibm.com", desc: "IBM Quantum Computing platform" },
          { title: "Qiskit Documentation", url: "qiskit.org", desc: "Documentation for the Qiskit quantum SDK" },
        ],
      },
      {
        title: "Other Platforms",
        links: [
          { title: "Google Cirq", url: "quantumai.google/cirq", desc: "Google's quantum computing framework" },
          { title: "Amazon Braket", url: "aws.amazon.com/braket", desc: "AWS quantum computing service" },
        ],
      },
    ],
  },
  knowledge: {
    title: "Foundational Knowledge & Research",
    Icon: LibraryBooksIcon,
    groups: [
      {
        title: "Quantum Threats & Algorithms",
        links: [
          { title: "Learning Shor's Algorithm", url: "learning.quantum.ibm.com", desc: "IBM Quantum explanation of Shor's algorithm" },
          { title: "Quantum Threat Timeline", url: "globalriskinstitute.org", desc: "Assessment of the quantum threat timeline" },
        ],
      },
      {
        title: "Research Repositories",
        links: [
          { title: "Cryptology ePrint Archive", url: "eprint.iacr.org", desc: "Repository for cryptographic research papers" },
          { title: "arXiv Quantum Physics", url: "arxiv.org/archive/quant-ph", desc: "Archive of quantum physics research papers" },
        ],
      },
    ],
  },
  frontiers: {
    title: "Quantum Frontiers & Breakthroughs",
    Icon: ExploreIcon,
    groups: [
      {
        title: "Recent Quantum Advances",
        links: [
          { title: "QEC below the surface code threshold", url: "nature.com", desc: "Below-threshold surface code memories on superconducting processors" },
          { title: "Modular photonic quantum computer", url: "nature.com", desc: "Scale model using 35 photonic chips for fault tolerance" },
        ],
      },
      {
        title: "Cryptography & Security",
        links: [
          { title: "Faster Post-Quantum TLS 1.3 (ML-KEM)", url: "arxiv.org", desc: "Optimized ML-KEM with AVX-512 and batch key generation" },
          { title: "Accelerating SLH-DSA", url: "eprint.iacr.org", desc: "Hardware hash unit up to 300× faster for FIPS 205" },
        ],
      },
    ],
  },
};

function CodexScreen() {
  const [section, setSection] = useState("standardization");
  const active = CODEX_SECTIONS[section];

  return (
    <div className="ks-stack">
      <header className="ks-page-head">
        <div>
          <h1>Cryptographic Codex</h1>
          <p>
            A resource hub for post-quantum cryptography, quantum computing
            frameworks, implementation libraries, and research.
          </p>
        </div>
      </header>

      <section className="ks-card ks-panel">
        <PanelHead Icon={CodexIcon} title="Browse topics" />
        <div className="ks-seg">
          {CODEX_TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              className={`ks-seg-btn${section === t.value ? " is-active" : ""}`}
              onClick={() => setSection(t.value)}
            >
              <t.Icon className="ks-seg-icon" />
              {t.label}
            </button>
          ))}
        </div>
      </section>

      <section className="ks-card ks-panel">
        <PanelHead Icon={active.Icon} title={active.title} />
        <div className="ks-codex-groups">
          {active.groups.map((g) => (
            <div key={g.title} className="ks-codex-group">
              <h4 className="ks-codex-group-title">{g.title}</h4>
              <ul className="ks-codex-links">
                {g.links.map((l) => (
                  <li key={l.title} className="ks-codex-link">
                    <LinkIcon className="ks-codex-link-icon" />
                    <div className="ks-codex-link-body">
                      <span className="ks-codex-link-title">
                        {l.title}
                        <LaunchIcon className="ks-codex-launch" />
                      </span>
                      <span className="ks-codex-link-desc">{l.desc}</span>
                    </div>
                    <span className="ks-codex-link-url mono">{l.url}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ── Import datasets ─────────────────────────────────────────────────── */

type Dataset = { name: string; runs: number; quantum: number; pqc: number };

const SEED_DATASETS: Dataset[] = [
  { name: "benchmarks-2026-q2.json", runs: 1284, quantum: 96, pqc: 1188 },
  { name: "kyber-sweep-768.json", runs: 420, quantum: 0, pqc: 420 },
  { name: "quantum-shor-grover.json", runs: 64, quantum: 64, pqc: 0 },
  { name: "falcon-regression.json", runs: 210, quantum: 0, pqc: 210 },
];

function ImportScreen() {
  const [datasets] = useState<Dataset[]>(SEED_DATASETS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const current = datasets[currentIdx];

  return (
    <div className="ks-stack">
      <header className="ks-page-head">
        <div>
          <h1>Import datasets</h1>
          <p>
            Import JSON benchmark or workload exports into your local dataset
            library. Drag a file onto the drop zone or use the controls below.
          </p>
        </div>
      </header>

      <section className="ks-card ks-panel">
        <PanelHead Icon={ImportIcon} title="Import & manage datasets" />
        <div className="ks-dropzone">
          <ImportIcon className="ks-dropzone-icon" />
          <span className="ks-dropzone-title">Drop a JSON file to import</span>
          <span className="ks-dropzone-sub">or use the Import button to browse</span>
          <div className="ks-dropzone-actions">
            <button type="button" className="ks-cta">
              <ImportIcon className="ks-cta-icon" />
              Import Dataset
            </button>
            <button type="button" className="ks-btn-outline">
              <SaveIcon className="ks-ghost-icon" />
              Save Current
            </button>
          </div>
        </div>
      </section>

      <div className="ks-grid-2">
        <div className="ks-card ks-panel">
          <PanelHead Icon={InfoIcon} title="Current dataset" />
          <dl className="ks-readout-list">
            <DataRow label="File" value={current.name} />
            <DataRow label="Total runs" value={current.runs.toLocaleString()} />
            <DataRow label="Quantum workloads" value={current.quantum.toLocaleString()} />
            <DataRow label="PQC / classical" value={current.pqc.toLocaleString()} />
          </dl>
        </div>
        <div className="ks-card ks-panel">
          <PanelHead Icon={SwapHorizIcon} title="Imported datasets" sub={`${datasets.length} files`} />
          <table className="ks-table">
            <thead>
              <tr>
                <th>File</th>
                <th>Runs</th>
                <th>Quantum</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {datasets.map((d, i) => (
                <tr key={d.name} className={i === currentIdx ? "is-current" : ""}>
                  <td className="ks-td-strong">{d.name}</td>
                  <td className="mono ks-td-muted">{d.runs.toLocaleString()}</td>
                  <td className="mono ks-td-muted">{d.quantum.toLocaleString()}</td>
                  <td style={{ textAlign: "right" }}>
                    {i === currentIdx ? (
                      <span className="ks-chip" style={{ color: "var(--status-success)" }}>
                        <span className="ks-dot" style={{ background: "var(--status-success)" }} />
                        Active
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="ks-link ks-link-btn"
                        onClick={() => setCurrentIdx(i)}
                      >
                        Switch
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Settings ────────────────────────────────────────────────────────── */

function SettingsScreen({
  dark,
  themePreference,
  setThemePreference,
}: {
  dark: boolean;
  themePreference: DemoThemePreference;
  setThemePreference: (v: DemoThemePreference) => void;
}) {
  const [transitions, setTransitions] = useState(true);
  const [animatedBg, setAnimatedBg] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [saved, setSaved] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (savedTimer.current) clearTimeout(savedTimer.current);
  }, []);

  const pickTheme = (value: DemoThemePreference) => setThemePreference(value);

  const save = () => {
    setSaved(true);
    if (savedTimer.current) clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="ks-stack">
      <header className="ks-page-head">
        <div>
          <h1>Settings</h1>
          <p>Configure application preferences, connections, and visual options.</p>
        </div>
        {saved && <StatusBadge status="success" label="Settings saved" />}
      </header>

      <section className="ks-card ks-panel">
        <PanelHead Icon={PaletteIcon} title="Appearance" />
        <div className="ks-grid-2">
          <label className="ks-field">
            <span>Theme</span>
            <select
              value={themePreference === "system" ? "system" : dark ? "dark" : "light"}
              onChange={(e) => pickTheme(e.target.value as DemoThemePreference)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">Follow System</option>
            </select>
          </label>
          <div className="ks-switch-stack">
            <div className="ks-switch-row">
              <div>
                <span className="ks-switch-label">Page transitions</span>
                <span className="ks-switch-sub">Animate route changes</span>
              </div>
              <Toggle on={transitions} onChange={() => setTransitions((v) => !v)} />
            </div>
            <div className="ks-switch-row">
              <div>
                <span className="ks-switch-label">Animated background</span>
                <span className="ks-switch-sub">Quantum lattice visualization</span>
              </div>
              <Toggle on={animatedBg} onChange={() => setAnimatedBg((v) => !v)} />
            </div>
          </div>
        </div>
      </section>

      <section className="ks-card ks-panel">
        <PanelHead Icon={SecurityIcon} title="Security & API" />
        <label className="ks-field">
          <span>IBM Quantum API Token</span>
          <div className="ks-input-affix">
            <input
              type={showToken ? "text" : "password"}
              value="ibmq-0a1b2c3d4e5f6g7h"
              readOnly
            />
            <button
              type="button"
              className="ks-icon-btn"
              onClick={() => setShowToken((v) => !v)}
              aria-label="Toggle token visibility"
            >
              {showToken ? <VisibilityOffIcon className="ks-ghost-icon" /> : <VisibilityIcon className="ks-ghost-icon" />}
            </button>
            <span className="ks-icon-btn" aria-hidden>
              <CheckCircleIcon className="ks-ghost-icon" style={{ color: "var(--status-success)" }} />
            </span>
            <span className="ks-icon-btn" aria-hidden>
              <DeleteIcon className="ks-ghost-icon" />
            </span>
          </div>
          <span className="ks-field-hint">Required for quantum workloads. Stored locally in the desktop app.</span>
        </label>
      </section>

      <div className="ks-settings-actions">
        <button type="button" className="ks-btn-outline">
          <RestoreIcon className="ks-ghost-icon" />
          Restore Defaults
        </button>
        <button type="button" className="ks-cta" onClick={save}>
          <SaveIcon className="ks-cta-icon" />
          Save Settings
        </button>
      </div>
    </div>
  );
}

/* ── Shell ───────────────────────────────────────────────────────────── */

export function KeystoneAppDemo({ brandMark }: { brandMark: ReactNode }) {
  const [route, setRoute] = useState<Route>("dashboard");
  const [dark, setDark] = useState(false);
  const [themePreference, setThemePreference] = useState<DemoThemePreference>("system");
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    );
  }, []);

  useEffect(() => {
    if (themePreference !== "system") return;

    const systemTheme = window.matchMedia(SYSTEM_THEME_QUERY);
    const syncTheme = () => setDark(getSitePrefersDark(systemTheme));
    const observer = new MutationObserver(syncTheme);

    syncTheme();
    systemTheme.addEventListener("change", syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      systemTheme.removeEventListener("change", syncTheme);
      observer.disconnect();
    };
  }, [themePreference]);

  const chooseDemoTheme = (next: DemoThemePreference) => {
    setThemePreference(next);
    if (next === "dark") setDark(true);
    if (next === "light") setDark(false);
  };

  return (
    <div className="window-stage">
      <section
        className={`app-window ks-app${dark ? " ks-dark" : ""}`}
        data-ks-theme={dark ? "dark" : "light"}
        data-testid="keystone-window"
      >
        <header className="ks-titlebar">
          <div className="traffic-lights" data-testid="traffic-lights" aria-hidden>
            <span />
            <span />
            <span />
          </div>
          <div className="ks-titlebar-brand">
            <span className="ks-titlebar-mark" aria-hidden>
              {brandMark}
            </span>
            <span className="ks-titlebar-name">Keystone</span>
            <span className="ks-titlebar-divider" aria-hidden />
            <span className="ks-titlebar-route">{ROUTE_TITLE[route]}</span>
          </div>
          <div className="ks-titlebar-spacer" aria-hidden />
        </header>

        <div className="ks-body">
          <aside className="ks-sidebar" aria-label="Keystone navigation">
            <nav className="ks-sidebar-nav">
              {NAV_GROUPS.map((group) => (
                <div key={group.label} className="ks-sidebar-group">
                  <span className="ks-sidebar-group-label">{group.label}</span>
                  {group.items.map(({ text, Icon, route: r }) => {
                    const active = r === route;
                    const interactive = Boolean(r);
                    return (
                      <button
                        key={text}
                        type="button"
                        className={`ks-sidebar-item${active ? " is-active" : ""}${interactive ? "" : " is-inert"}`}
                        onClick={() => r && setRoute(r)}
                        disabled={!interactive}
                        title={interactive ? undefined : "Available in the desktop app"}
                      >
                        <Icon className="ks-sidebar-icon" />
                        <span>{text}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>
            <div className="ks-sidebar-footer">
              <button
                type="button"
                className="ks-theme-toggle"
                onClick={() => chooseDemoTheme(dark ? "light" : "dark")}
                aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
              >
                <span className={`ks-toggle-track${dark ? " is-on" : ""}`} aria-hidden />
                {dark ? (
                  <DarkModeIcon className="ks-toggle-icon" />
                ) : (
                  <LightModeIcon className="ks-toggle-icon" />
                )}
              </button>
              <span className="ks-version mono">v1.0.0</span>
            </div>
          </aside>

          <main className="ks-main">
            <div className="ks-content">
              {route === "dashboard" && (
                <DashboardScreen today={today} onRun={() => setRoute("benchmarks")} />
              )}
              {route === "benchmarks" && <BenchmarksScreen />}
              {route === "visualize" && <VisualizeScreen />}
              {route === "job-history" && <JobHistoryScreen />}
              {route === "quantum" && <QuantumScreen />}
              {route === "encryption" && <EncryptionScreen />}
              {route === "schedule" && <ScheduleScreen />}
              {route === "codex" && <CodexScreen />}
              {route === "import" && <ImportScreen />}
              {route === "settings" && (
                <SettingsScreen
                  dark={dark}
                  themePreference={themePreference}
                  setThemePreference={chooseDemoTheme}
                />
              )}
            </div>
          </main>
        </div>
      </section>
    </div>
  );
}

export default KeystoneAppDemo;
