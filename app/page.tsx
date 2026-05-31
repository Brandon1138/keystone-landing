import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  Cpu,
  ExternalLink,
  FileCheck2,
  FileJson,
  Gauge,
  Github,
  HardDrive,
  KeyRound,
  Layers3,
  Play,
  RefreshCw,
  Search,
  ShieldCheck,
  TimerReset,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { LiquidGlassMaterial } from "@/components/landing/LiquidGlassMaterial";
import { MobileNav } from "@/components/landing/MobileNav";
import { AppleLogo, WindowsLogo, TuxLogo } from "@/components/landing/BrandLogos";
import { SmartDownloadButton } from "@/components/landing/SmartDownloadButton";

const GITHUB_URL = "https://github.com/Brandon1138/keystone";

const NAV_LINKS = [
  { label: "Overview", href: "#overview" },
  { label: "Benchmarks", href: "#benchmarks" },
  { label: "Visualize", href: "#visualize" },
  { label: "Workloads", href: "#workloads" },
  { label: "Evidence", href: "#evidence" },
  { label: "About", href: "#about" },
];

const ALGORITHMS = [
  { name: "ML-KEM", detail: "Key encapsulation", meta: "512, 768, 1024", Icon: KeyRound },
  { name: "ML-DSA", detail: "Digital signatures", meta: "44, 65, 87", Icon: ShieldCheck },
  { name: "Falcon", detail: "Compact signatures", meta: "512, 1024", Icon: CircleDot },
  { name: "SPHINCS+", detail: "Hash signatures", meta: "SHA2, SHAKE", Icon: Layers3 },
  { name: "Classical", detail: "Baseline comparison", meta: "RSA, ECDSA, AES", Icon: Cpu },
] as const;

const PROOF_POINTS = [
  {
    title: "Local execution",
    body: "Benchmark runs stay on the Mac that produced them.",
    Icon: HardDrive,
  },
  {
    title: "Parameter evidence",
    body: "Schemes, variants, iterations, and backend context remain visible.",
    Icon: FileCheck2,
  },
  {
    title: "Exportable reports",
    body: "Results are shaped for review, audits, and research notes.",
    Icon: FileJson,
  },
] as const;

const BENCHMARK_ROWS = [
  { label: "Key generation", avg: "0.006041 ms", peak: "196.6 MB", status: "Complete" },
  { label: "Encapsulation", avg: "0.005462 ms", peak: "16.4 MB", status: "Complete" },
  { label: "Decapsulation", avg: "0.006474 ms", peak: "0 KB", status: "Complete" },
] as const;

const CHART_BARS = [18, 28, 14, 46, 34, 68, 22, 78, 30, 42, 20, 56, 24, 88, 50, 72];

const EVIDENCE = [
  {
    title: "Benchmarks resolve into evidence.",
    body: "Keystone keeps the path from primitive execution to export visible: run settings, phase metrics, throughput, memory profile, and report output.",
    Icon: Gauge,
  },
  {
    title: "Visualization remains analytical.",
    body: "Charts are treated as inspection tools rather than decoration, with sorting, comparison, and realistic algorithm range pressure.",
    Icon: BarChart3,
  },
  {
    title: "Quantum workload setup is explicit.",
    body: "Batch scheduling exposes runs, shots, parameters, and backends so complex experiments can be repeated without guessing.",
    Icon: TimerReset,
  },
] as const;

const RELEASE_GATES = [
  "verify-native",
  "build-addon",
  "verify-crypto-addons",
  "build-benchmarks",
  "package-mac-prod",
];

const FOOTER_GROUPS = [
  {
    heading: "Product",
    links: [
      ["Overview", "#overview"],
      ["Benchmarks", "#benchmarks"],
      ["Algorithms", "#algorithms"],
      ["Download", "#download"],
    ],
  },
  {
    heading: "Resources",
    links: [
      ["Docs", "/docs/"],
      ["Reports", "/reports/"],
      ["Releases", "/releases/"],
      ["Schemes", "/schemes/"],
    ],
  },
  {
    heading: "Source",
    links: [
      ["GitHub", GITHUB_URL],
      ["Security", "/security/"],
      ["Contact", "/contact/"],
      ["License", "/terms/"],
    ],
  },
] as const;

function KeystoneGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 80" aria-hidden className={className}>
      <path d="M8 4h18v72H8V4Z" fill="currentColor" />
      <path d="M38 4h18v20L31 49l25 27H38L17 54l21-22V4Z" fill="currentColor" />
      <path d="M31 50 56 25v16L43 54l13 14v8L31 50Z" fill="var(--color-primary)" />
    </svg>
  );
}

function BrandLink() {
  return (
    <Link href="/" aria-label="Keystone home" className="brand-link">
      <span className="brand-mark">
        <KeystoneGlyph className="h-7 w-6" />
      </span>
      <span>Keystone</span>
    </Link>
  );
}

function ToolbarButton({ Icon, label }: { Icon: LucideIcon; label: string }) {
  return (
    <button type="button" className="toolbar-button" aria-label={label} tabIndex={-1}>
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

function StatusBadge({ tone = "ready", children }: { tone?: "ready" | "success" | "run"; children: string }) {
  return (
    <span className={`status-badge ${tone}`}>
      <span />
      {children}
    </span>
  );
}

function AppSidebar() {
  const execute = ["Quantum Workloads", "Benchmarks", "Encryption", "Schedule Jobs"];
  const analyze = ["Visualize", "Codex", "Job History"];

  return (
    <aside className="app-sidebar" aria-label="Keystone app navigation">
      <div className="sidebar-group">
        <span>Execute</span>
        {execute.map((item) => (
          <div key={item} className={item === "Benchmarks" ? "sidebar-item active" : "sidebar-item"}>
            <span className="sidebar-symbol" />
            <small>{item}</small>
          </div>
        ))}
      </div>
      <div className="sidebar-group">
        <span>Analyze</span>
        {analyze.map((item) => (
          <div key={item} className="sidebar-item">
            <span className="sidebar-symbol" />
            <small>{item}</small>
          </div>
        ))}
      </div>
      <div className="sidebar-bottom">
        <span />
        <small>v1.0.0</small>
      </div>
    </aside>
  );
}

function BenchmarkPanel() {
  return (
    <div className="benchmark-panel" aria-label="Benchmark configuration preview">
      <div className="panel-header">
        <div>
          <span>Configuration</span>
          <strong>Kyber benchmark run</strong>
        </div>
        <StatusBadge tone="ready">Ready</StatusBadge>
      </div>
      <div className="config-grid">
        <label>
          Algorithm
          <span>ML-KEM (Kyber)</span>
        </label>
        <label>
          Security
          <span>512</span>
        </label>
        <label>
          Iterations
          <span>10,000</span>
        </label>
        <button type="button" tabIndex={-1}>
          <Play className="h-3.5 w-3.5" />
          Run Benchmark
        </button>
      </div>
    </div>
  );
}

function ResultRows() {
  return (
    <div className="result-grid" aria-label="Completed benchmark phase metrics">
      {BENCHMARK_ROWS.map((row) => (
        <article key={row.label} className="result-card">
          <div className="result-heading">
            <span>{row.label}</span>
            <StatusBadge tone="success">{row.status}</StatusBadge>
          </div>
          <dl>
            <div>
              <dt>Avg time</dt>
              <dd>{row.avg}</dd>
            </div>
            <div>
              <dt>Throughput</dt>
              <dd>165,546 ops/s</dd>
            </div>
            <div>
              <dt>Peak memory</dt>
              <dd>{row.peak}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
}

function ChartPreview() {
  return (
    <div className="chart-preview" aria-label="Average time chart preview">
      <div className="chart-header">
        <div>
          <span>Visualization</span>
          <strong>Average Time (ms)</strong>
        </div>
        <div className="chart-tools" aria-hidden>
          <Search className="h-3.5 w-3.5" />
          <RefreshCw className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="chart-bars" aria-hidden>
        {CHART_BARS.map((height, index) => (
          <span key={`${height}-${index}`} style={{ height: `${height}%` }} />
        ))}
      </div>
      <div className="chart-axis" aria-hidden>
        <span>ML-KEM</span>
        <span>Falcon</span>
        <span>SPHINCS+</span>
        <span>RSA</span>
      </div>
    </div>
  );
}

function KeystoneWindow() {
  return (
    <div className="window-stage" aria-label="Keystone macOS app preview">
      <div className="ghost-window ghost-one" aria-hidden>
        <StatusBadge tone="run">Running</StatusBadge>
      </div>
      <div className="ghost-window ghost-two" aria-hidden>
        <StatusBadge tone="success">Complete</StatusBadge>
      </div>
      <section className="app-window" data-testid="keystone-window">
        <header className="window-toolbar">
          <div className="traffic-lights" data-testid="traffic-lights" aria-hidden>
            <span />
            <span />
            <span />
          </div>
          <LiquidGlassMaterial className="toolbar-status" cornerRadius={18}>
            <StatusBadge tone="ready">Ready</StatusBadge>
          </LiquidGlassMaterial>
          <div className="toolbar-cluster">
            <ToolbarButton Icon={BarChart3} label="Benchmarks" />
            <ToolbarButton Icon={FileCheck2} label="Reports" />
            <ToolbarButton Icon={RefreshCw} label="Refresh" />
            <ToolbarButton Icon={Search} label="Search" />
            <button type="button" className="toolbar-menu" aria-label="View options" tabIndex={-1}>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </header>
        <div className="window-body">
          <AppSidebar />
          <main className="app-main">
            <div className="app-title-row">
              <div>
                <h2>Benchmarks</h2>
                <p>PQC and classical cryptographic algorithm performance benchmarking</p>
              </div>
              <StatusBadge tone="success">Complete</StatusBadge>
            </div>
            <BenchmarkPanel />
            <ResultRows />
            <ChartPreview />
          </main>
        </div>
      </section>
    </div>
  );
}

function AlgorithmStrip() {
  return (
    <section id="algorithms" className="algorithm-strip" aria-label="Algorithm coverage">
      <div className="container-page algorithm-inner">
        <div className="algorithm-label">
          <span>Algorithm coverage</span>
          <strong>Post-quantum and classical baselines</strong>
        </div>
        <div className="algorithm-list">
          {ALGORITHMS.map(({ name, detail, meta, Icon }) => (
            <article key={name} data-testid="algorithm-chip" className="algorithm-chip">
              <Icon className="h-4 w-4" />
              <div>
                <h3>{name}</h3>
                <p>{detail}</p>
                <span>{meta}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function MacDevice() {
  return (
    <div className="mac-device" aria-hidden>
      <div className="device-screen">
        <div className="device-toolbar" />
        <div className="device-layout">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="device-base" />
    </div>
  );
}

export default function Page() {
  return (
    <>
      <header className="site-header">
        <LiquidGlassMaterial className="nav-material" cornerRadius={28}>
          <div className="header-inner">
            <BrandLink />
            <nav aria-label="Primary" className="primary-nav">
              {NAV_LINKS.map((link) => (
                <Link key={link.label} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="header-actions">
              <Link className="icon-link" href={GITHUB_URL} aria-label="GitHub">
                <Github className="h-4 w-4" />
              </Link>
              <SmartDownloadButton className="download-link" githubUrl={GITHUB_URL} showSpan />
              <MobileNav links={NAV_LINKS} githubUrl={GITHUB_URL} />
            </div>
          </div>
        </LiquidGlassMaterial>
      </header>

      <main>
        <section id="overview" className="hero-section">
          <div className="hero-background" aria-hidden />
          <div className="container-page hero-grid">
            <div className="hero-copy">
              <div className="platform-pill">
                <AppleLogo className="h-4 w-4" />
                Built for Mac
              </div>
              <h1>
                <span className="no-break">Post-quantum</span> benchmarking, built for Mac.
              </h1>
              <p>
                Keystone is a native desktop instrument for measuring, comparing, and reporting
                post-quantum and classical cryptographic algorithms with reproducible local evidence.
              </p>
              <div className="hero-actions">
                <SmartDownloadButton className="primary-action" githubUrl={GITHUB_URL} />
                <Link className="secondary-action" href="/reports/">
                  View evidence
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <ul className="hero-points" aria-label="Keystone proof points">
                <li>
                  <CheckCircle2 className="h-4 w-4" />
                  macOS first
                </li>
                <li>
                  <CheckCircle2 className="h-4 w-4" />
                  Local benchmark runs
                </li>
                <li>
                  <CheckCircle2 className="h-4 w-4" />
                  Windows and Linux planned
                </li>
              </ul>
            </div>
            <KeystoneWindow />
          </div>
          <AlgorithmStrip />
        </section>

        <section id="benchmarks" className="evidence-section">
          <div className="container-page evidence-grid">
            <div className="section-heading">
              <span>Release evidence</span>
              <h2>Designed around the proof a cryptography tool has to carry.</h2>
              <p>
                Every surface maps to a real workflow — benchmark phases, visualization, workload
                scheduling, and exports. Nothing decorative, nothing you can’t reproduce locally.
              </p>
            </div>
            <div className="proof-list">
              {PROOF_POINTS.map(({ title, body, Icon }) => (
                <article key={title} data-testid="proof-card" className="proof-item">
                  <Icon className="h-5 w-5" />
                  <div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="visualize" className="instrument-section">
          <div className="container-page instrument-grid">
            <div className="instrument-copy">
              <span>Native instrument</span>
              <h2>Not a cloud dashboard pretending to be cryptography.</h2>
              <p>
                Keystone is positioned as a Mac-first lab bench: run locally, inspect the output, and
                package results only after native dependency and benchmark gates pass.
              </p>
              <Link href="/docs/" className="inline-link">
                Read the docs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="instrument-panel" aria-label="Keystone workflow surfaces">
              {EVIDENCE.map(({ title, body, Icon }) => (
                <article key={title} className="instrument-row">
                  <Icon className="h-5 w-5" />
                  <div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="evidence" className="spec-section">
          <div className="container-page spec-grid">
            <div className="spec-table" aria-label="Keystone benchmark comparison sample">
              <div className="spec-table-header">
                <span>Sample comparison</span>
                <strong>Average time, lower is better</strong>
              </div>
              {[
                ["ML-KEM (Kyber)", "Key encapsulation", "0.0060", "512"],
                ["ML-DSA (Dilithium)", "Digital signature", "0.0157", "512"],
                ["Falcon", "Digital signature", "0.0108", "1024"],
                ["SPHINCS+", "Hash signature", "0.5033", "SHAKE"],
              ].map(([algorithm, type, time, security]) => (
                <div key={algorithm} className="spec-row">
                  <span>{algorithm}</span>
                  <span>{type}</span>
                  <span>{time} ms</span>
                  <span>{security}</span>
                </div>
              ))}
            </div>
            <div className="spec-copy">
              <span>Export posture</span>
              <h2>Keep release claims honest until every platform is packaged.</h2>
              <p>
                macOS leads because it is the current local package target. Windows and Linux remain
                visible as planned paths, not finished promises.
              </p>
              <div className="release-gates" aria-label="macOS package gates">
                {RELEASE_GATES.map((step) => (
                  <span key={step}>{step}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="workloads" className="download-section">
          <div id="download" className="container-page download-grid">
            <div className="download-copy">
              <span>Download</span>
              <h2>Start with the Mac build. Keep the rest in the release path.</h2>
              <p>
                Keystone’s primary package is macOS first. Windows and Linux follow after native
                artifacts are built and smoke-tested on their target operating systems.
              </p>
            </div>
            <div className="download-panel">
              <article data-testid="download-card" className="download-card available">
                <AppleLogo className="h-6 w-6" />
                <div>
                  <h3>macOS</h3>
                  <p>Apple Silicon and Intel, DMG release path.</p>
                </div>
                <Link href={GITHUB_URL}>
                  Download for macOS
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </article>
              <article data-testid="download-card" className="download-card pending">
                <WindowsLogo className="h-6 w-6" />
                <div>
                  <h3>Windows</h3>
                  <p>NSIS package target, validation pending.</p>
                </div>
                <button type="button" disabled>
                  Windows package later
                </button>
              </article>
              <article data-testid="download-card" className="download-card pending">
                <TuxLogo className="h-6 w-6" />
                <div>
                  <h3>Linux</h3>
                  <p>AppImage target, distro validation pending.</p>
                </div>
                <button type="button" disabled>
                  Linux package later
                </button>
              </article>
            </div>
            <MacDevice />
          </div>
        </section>
      </main>

      <footer id="about" role="contentinfo" className="site-footer">
        <div className="container-page footer-grid">
          <div>
            <BrandLink />
            <p>
              Mac-first post-quantum cryptography benchmarking, built around local execution and
              reproducible evidence.
            </p>
          </div>
          {FOOTER_GROUPS.map((group) => (
            <div key={group.heading}>
              <h3>{group.heading}</h3>
              <ul>
                {group.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="footer-release">
            <h3>Status</h3>
            <p>macOS build ships today. Windows and Linux follow once native packages clear their gates.</p>
          </div>
        </div>
        <div className="container-page footer-bottom">
          <span>© 2026 Keystone Labs Inc. All rights reserved.</span>
          <span>
            <Link href="/terms/">Terms of Use</Link>
            <Link href="/privacy/">Privacy Policy</Link>
          </span>
        </div>
      </footer>
    </>
  );
}
