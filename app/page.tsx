import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  Cpu,
  FileCheck2,
  FileJson,
  Gauge,
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
import manifestJson from "@/content/releases/latest.json";
import {
  resolveReleaseState,
  validateReleaseManifest,
} from "@/lib/releases/manifest";

const release = resolveReleaseState(
  validateReleaseManifest(manifestJson),
  process.env.KEYSTONE_ARTIFACT_BASE_URL,
);

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
    heading: "Project",
    links: [
      ["Case study", "https://mikoshi.studio/cases/keystone"],
      ["Security", "/security/"],
      ["Contact", "/contact/"],
      ["Documentation", "/docs/"],
    ],
  },
] as const;

function KeystoneGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1024 1024" aria-hidden className={className} style={{ overflow: "visible" }}>
      <g transform="translate(512, 512) scale(1.1)">
        <g transform="translate(-512, -512)">
          <path
            d="M499.1,167.499C499.109,171.304 499.105,251.245 500.046,291.497C500.146,295.738 497.99,294.817 437.439,330.395C343.908,385.351 341.923,383.579 337.715,391.622C333.598,399.492 335.224,408.164 335.03,533.498C335.008,548.045 334.892,547.963 335.041,562.5C335.232,581.021 335.269,581.459 333.518,582.528C324.983,587.734 204.738,657.756 201.637,659.791C198.44,661.89 199.198,657.135 198.527,646.498C198.229,641.792 198.426,363.14 198.443,338.5C198.461,313.151 198.859,307.114 221.301,295.155C231.518,289.712 231.167,289.235 279.749,260.942C496.78,134.548 498.134,132.401 499.052,134.671C499.088,134.758 499.099,164.873 499.1,167.499Z"
            fill="currentColor"
            opacity="0.95"
          />
          <path
            d="M823.89,321.46C824.527,329.656 823.985,539.618 824.173,576.503C824.177,577.22 824.216,584.927 823.463,585.437C821.844,586.534 707.402,520.1 701.254,516.225C697.51,513.865 690.327,509.803 690.327,509.803C690.327,509.803 691.742,401.605 689.091,392.624C686.564,384.062 684.909,384.473 605.67,339.208C531.227,296.682 531.113,296.971 524.783,293.042C522.49,291.619 524.099,290.691 523.839,206.497C523.642,142.943 523.258,143.014 523.255,137.494C523.253,134.78 523.116,133.287 525.534,134.412C530.228,136.595 735.595,255.11 746.781,262.031C778.027,281.361 778.962,279.632 810.226,298.96C822.333,306.444 823.657,320.245 823.89,321.46Z"
            fill="var(--color-primary)"
          />
          <path
            d="M244.452,699.579C216.357,683.293 216.142,683.749 213.785,682.2C212.29,681.217 214.562,679.947 214.739,679.848C239.343,666.085 305.443,626.485 322.266,617.072C341.588,606.262 345.393,598.962 363.201,609.96C369.206,613.668 480.979,676.243 491.234,681.984C514.189,694.835 520.086,688.413 535.66,679.782C539.562,677.62 606.122,639.029 609.583,637.776C611.285,637.16 611.473,637.44 629.625,648.271C642.472,655.937 656.424,663.703 658.774,665.01C665.875,668.962 746.513,713.843 747.456,714.549C749.217,715.867 747.291,716.488 709.739,738.875C678.818,757.309 678.906,757.41 676.215,759.005C666.619,764.691 559.115,828.392 556.247,830.05C527.241,846.826 522.47,851.135 506.462,848.829C495.342,847.228 496.006,845.224 410.325,795.811C358.061,765.67 265.064,710.957 244.452,699.579Z"
            fill="currentColor"
            opacity="0.35"
          />
          <path
            d="M644.666,627.207C639.663,624.264 639.351,624.369 639.359,623.497C639.368,622.427 675.676,602.796 678.511,602.884C682.239,602.999 762.062,649.933 794.298,666.906C812.609,676.547 813.113,676.911 812.673,678.597C812.623,678.789 775.918,700.597 774.517,700.691C772.22,700.845 667.085,639.601 644.666,627.207Z"
            fill="currentColor"
            opacity="0.25"
          />
          <path
            d="M824.626,632.499C824.638,651.974 825.456,656.936 822.312,654.902C822.231,654.849 713.298,593.03 695.683,584.134C688.85,580.683 690.37,579.107 690.35,571.499C690.275,542.667 689.635,539.183 692.459,540.604C692.463,540.607 805.486,603.354 815.314,608.811C820.067,611.449 824.752,613.25 824.83,615.467C824.878,616.829 824.978,619.627 824.626,632.499Z"
            fill="currentColor"
            opacity="0.25"
          />
        </g>
      </g>
    </svg>
  );
}

function BrandLink() {
  return (
    <Link href="/" aria-label="Keystone home" className="brand-link">
      <span className="brand-mark">
        <KeystoneGlyph />
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
              <SmartDownloadButton
                available={release.available}
                version={release.available ? release.manifest.version : undefined}
                className="download-link"
                showSpan
              />
              <MobileNav
                links={NAV_LINKS}
                releaseAvailable={release.available}
                releaseVersion={
                  release.available ? release.manifest.version : undefined
                }
              />
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
                <SmartDownloadButton
                  available={release.available}
                  version={release.available ? release.manifest.version : undefined}
                  className="primary-action"
                />
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
                  Reviewable evidence
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
              <span>Benchmark posture</span>
              <h2>Machine-relative, reviewable.</h2>
              <p>
                The values shown here are interface fixtures, not universal
                performance claims. Verified machine metadata and reproducible
                reference runs belong in Keystone Harness; re-run the suite
                locally for machine-specific results.
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
              <h2>
                {release.available
                  ? "Keystone is available as a signed macOS Public Beta."
                  : "macOS beta release verification in progress."}
              </h2>
              <p>
                The first public release targets macOS. Download visibility
                remains blocked until the DMG, manifest, checksum, signing,
                notarization, filename, version, and live response all agree.
              </p>
            </div>
            <div className="download-panel">
              <article
                data-testid="download-card"
                className={`download-card ${release.available ? "available" : "pending"}`}
              >
                <AppleLogo className="h-6 w-6" />
                <div>
                  <h3>macOS</h3>
                  <p>
                    {release.available
                      ? `Signed and notarized beta ${release.manifest.version}.`
                      : "Signed and notarized DMG verification pending."}
                  </p>
                </div>
                <SmartDownloadButton
                  available={release.available}
                  version={release.available ? release.manifest.version : undefined}
                  className="download-card-action"
                />
              </article>
              <article data-testid="download-card" className="download-card pending">
                <WindowsLogo className="h-6 w-6" />
                <div>
                  <h3>Windows</h3>
                  <p>NSIS package target, validation pending.</p>
                </div>
                <button type="button" disabled>
                  Windows validation required
                </button>
              </article>
              <article data-testid="download-card" className="download-card pending">
                <TuxLogo className="h-6 w-6" />
                <div>
                  <h3>Linux</h3>
                  <p>AppImage target, distro validation pending.</p>
                </div>
                <button type="button" disabled>
                  Linux validation required
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
            <p>
              {release.available
                ? `Signed macOS Public Beta ${release.manifest.version}.`
                : "macOS beta release verification in progress."}
            </p>
          </div>
        </div>
        <div className="container-page footer-bottom">
          <span>© 2026 Brandon Aron. Keystone.</span>
          <span>
            <Link href="/terms/">Terms of Use</Link>
            <Link href="/privacy/">Privacy Policy</Link>
          </span>
        </div>
      </footer>
    </>
  );
}
