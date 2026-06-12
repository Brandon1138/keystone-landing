import Link from "next/link";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import type { ComponentType, ReactNode } from "react";

import { LiquidGlassMaterial } from "@/components/landing/LiquidGlassMaterial";
import { MobileNav } from "@/components/landing/MobileNav";
import { AppleLogo } from "@/components/landing/BrandLogos";
import { SmartDownloadButton } from "@/components/landing/SmartDownloadButton";
import { InterfaceContourField } from "@/components/landing/InterfaceContourField";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  ArrowForwardIcon,
  BarChartIcon,
  CheckCircleIcon,
  CodexIcon,
  EncryptionIcon,
  ErrorIcon,
  HistoryIcon,
  ImportIcon,
  LightModeIcon,
  MoreHorizIcon,
  QuantumIcon,
  RefreshIcon,
  ScheduleIcon,
  SearchIcon,
  SettingsIcon,
  SpeedIcon,
  TerminalIcon,
  VerifiedIcon,
  VisualizeIcon,
} from "@/components/landing/AppIcons";

type IconCmp = ComponentType<{ className?: string }>;

const GITHUB_URL = "https://github.com/Brandon1138/keystone";

const NAV_LINKS = [
  { label: "Benchmarks", href: "#benchmarks" },
  { label: "Docs", href: "/docs/" },
  { label: "Releases", href: "/releases/" },
];

// Sample run on Apple silicon, 10,000 iterations per operation.
const BENCHMARKS = [
  { name: "ML-KEM", detail: "Kyber · key encapsulation", ms: 0.006 },
  { name: "Falcon", detail: "Lattice · digital signature", ms: 0.0108 },
  { name: "ML-DSA", detail: "Dilithium · digital signature", ms: 0.0157 },
  { name: "SPHINCS+", detail: "Hash-based · digital signature", ms: 0.5033 },
] as const;

const COVERAGE = [
  { family: "ML-KEM", sets: "512 · 768 · 1024" },
  { family: "ML-DSA", sets: "44 · 65 · 87" },
  { family: "Falcon", sets: "512 · 1024" },
  { family: "SPHINCS+", sets: "SHA2 · SHAKE" },
  { family: "Baselines", sets: "RSA · ECDSA · AES" },
] as const;

const RELEASE_GATES = [
  "verify-native",
  "build-addon",
  "verify-crypto-addons",
  "build-benchmarks",
  "package-mac-prod",
] as const;

const PROOF_POINTS = [
  {
    title: "Local execution",
    body: "Benchmarks execute on your own hardware. The runtime, the dataset, and the results never leave the machine.",
  },
  {
    title: "Parameter evidence",
    body: "Every run records its algorithm, parameter set, iteration count, and timing. A result you can't trace is a result you can't trust.",
  },
  {
    title: "Exportable reports",
    body: "Runs resolve into reports you can hand to a reviewer, with parameters and integrity checks attached.",
  },
] as const;

const QUICK_ACTIONS: { title: string; description: string; Icon: IconCmp }[] = [
  { title: "Run Benchmarks", description: "Measure PQC and classical cryptographic performance.", Icon: SpeedIcon },
  { title: "Run Encryption", description: "Generate keys, encrypt, sign, decrypt, and verify.", Icon: EncryptionIcon },
  { title: "Quantum Workloads", description: "Execute Shor and Grover on simulators or IBM hardware.", Icon: QuantumIcon },
];

const SIDEBAR_GROUPS: { label: string; items: { text: string; Icon: IconCmp }[] }[] = [
  {
    label: "Execute",
    items: [
      { text: "Quantum Workloads", Icon: QuantumIcon },
      { text: "Benchmarks", Icon: SpeedIcon },
      { text: "Encryption", Icon: EncryptionIcon },
      { text: "Schedule Jobs", Icon: ScheduleIcon },
    ],
  },
  {
    label: "Analyze",
    items: [
      { text: "Visualize", Icon: VisualizeIcon },
      { text: "Codex", Icon: CodexIcon },
      { text: "Job History", Icon: HistoryIcon },
    ],
  },
  {
    label: "Manage",
    items: [
      { text: "Import", Icon: ImportIcon },
      { text: "Settings", Icon: SettingsIcon },
    ],
  },
];

const RECENT_RUNS = [
  { algorithm: "kyber", status: "failed", started: "2:59:51 AM", iterations: "10,000" },
  { algorithm: "kyber", status: "failed", started: "3:00:27 AM", iterations: "10,000" },
  { algorithm: "kyber", status: "completed", started: "3:25:57 AM", iterations: "10,000" },
  { algorithm: "kyber", status: "completed", started: "3:37:27 PM", iterations: "10,000" },
] as const;

const EVIDENCE_STATS = [
  { label: "Local runtime", value: "Ready" },
  { label: "Evidence", value: "4 runs" },
  { label: "Dataset", value: "Default" },
  { label: "Integrity", value: "2" },
] as const;

const TOOL_LINKS: { title: string; caption: string; Icon: IconCmp }[] = [
  { title: "Schedule Jobs", caption: "Open schedule jobs", Icon: ScheduleIcon },
  { title: "Visualize", caption: "Open visualize", Icon: VisualizeIcon },
  { title: "Codex", caption: "Open codex", Icon: CodexIcon },
  { title: "Job History", caption: "Open job history", Icon: HistoryIcon },
];

const FOOTER_GROUPS = [
  {
    heading: "Product",
    links: [
      ["Overview", "#overview"],
      ["Benchmarks", "#benchmarks"],
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

/* Section index — the one repeating system on the page. Drafting-sheet
   title block: index and label on the left, annotation on the right,
   a hairline rule between. */
function SectionIndex({
  index,
  label,
  annotation,
}: {
  index: string;
  label: string;
  annotation: string;
}) {
  return (
    <div className="section-index">
      <span>
        {index} · {label}
      </span>
      <span className="section-index-rule" aria-hidden />
      <span>{annotation}</span>
    </div>
  );
}

function ToolbarButton({ Icon, label }: { Icon: IconCmp; label: string }) {
  return (
    <button type="button" className="toolbar-button" aria-label={label} tabIndex={-1}>
      <Icon />
    </button>
  );
}

const STATUS_TONES: Record<string, { bg: string; Icon: IconCmp }> = {
  ready: { bg: "#64748B", Icon: ScheduleIcon },
  success: { bg: "#059669", Icon: CheckCircleIcon },
  run: { bg: "#006FE6", Icon: CheckCircleIcon },
  fail: { bg: "#DC2626", Icon: ErrorIcon },
};

function StatusBadge({ tone = "ready", children }: { tone?: keyof typeof STATUS_TONES; children: string }) {
  const { bg, Icon } = STATUS_TONES[tone] ?? STATUS_TONES.ready;
  return (
    <span className="status-badge" style={{ backgroundColor: bg }}>
      <Icon className="status-badge-icon" />
      {children}
    </span>
  );
}

function AppSidebar() {
  return (
    <aside className="app-sidebar" aria-label="Keystone app navigation">
      {SIDEBAR_GROUPS.map((group) => (
        <div key={group.label} className="sidebar-group">
          <span>{group.label}</span>
          {group.items.map(({ text, Icon }) => (
            <div key={text} className="sidebar-item">
              <Icon className="sidebar-icon" aria-hidden />
              <small>{text}</small>
            </div>
          ))}
        </div>
      ))}
      <div className="sidebar-bottom">
        <span className="sidebar-toggle-track" aria-hidden />
        <LightModeIcon className="sidebar-toggle-icon" />
        <small>v1.0.0</small>
      </div>
    </aside>
  );
}

function DashboardCard({
  label,
  Icon,
  action,
  className = "",
  children,
}: {
  label: string;
  Icon: IconCmp;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`dashboard-card ${className}`.trim()}>
      <div className="dashboard-card-head">
        <span className="dashboard-card-label">
          <Icon className="dashboard-card-label-icon" />
          {label}
        </span>
        {action}
      </div>
      {children}
    </section>
  );
}

function QuickActions() {
  return (
    <DashboardCard label="Quick actions" Icon={TerminalIcon} className="dashboard-quick">
      <div className="dashboard-command-grid">
        {QUICK_ACTIONS.map(({ title, description, Icon }) => (
          <div key={title} className="dashboard-command">
            <span className="dashboard-command-icon">
              <Icon />
            </span>
            <span className="dashboard-command-text">
              <strong>{title}</strong>
              <span>{description}</span>
            </span>
            <ArrowForwardIcon className="dashboard-command-arrow" />
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

function RecentRuns() {
  return (
    <DashboardCard
      label="Recent runs"
      Icon={HistoryIcon}
      action={
        <span className="dashboard-pill-button" aria-hidden>
          View all
          <ArrowForwardIcon className="dashboard-pill-icon" />
        </span>
      }
    >
      <table className="dashboard-table" aria-label="Recent benchmark runs">
        <thead>
          <tr>
            <th>Algorithm</th>
            <th>Status</th>
            <th>Started</th>
            <th>Iterations</th>
          </tr>
        </thead>
        <tbody>
          {RECENT_RUNS.map((run, index) => (
            <tr key={`${run.started}-${index}`}>
              <td>{run.algorithm}</td>
              <td>
                <StatusBadge tone={run.status === "completed" ? "success" : "fail"}>
                  {run.status}
                </StatusBadge>
              </td>
              <td className="dashboard-mono">{run.started}</td>
              <td className="dashboard-mono">{run.iterations}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardCard>
  );
}

function EvidenceStatus() {
  return (
    <DashboardCard label="Evidence status" Icon={VerifiedIcon}>
      <div className="dashboard-evidence-grid">
        {EVIDENCE_STATS.map(({ label, value }) => (
          <div key={label} className="dashboard-evidence-stat">
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <div className="dashboard-evidence-footer">
        <span className="dashboard-evidence-note">
          <CheckCircleIcon className="dashboard-evidence-note-icon" />
          Local evidence store available
        </span>
        <button type="button" className="dashboard-run-button" tabIndex={-1}>
          Run Benchmark
        </button>
      </div>
    </DashboardCard>
  );
}

function ToolsResources() {
  return (
    <DashboardCard label="Tools and resources" Icon={CodexIcon} className="dashboard-tools">
      <div className="dashboard-command-grid dashboard-command-grid-tools">
        {TOOL_LINKS.map(({ title, caption, Icon }) => (
          <div key={title} className="dashboard-command">
            <span className="dashboard-command-icon">
              <Icon />
            </span>
            <span className="dashboard-command-text">
              <strong>{title}</strong>
              <span>{caption}</span>
            </span>
            <ArrowForwardIcon className="dashboard-command-arrow" />
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

function KeystoneWindow() {
  return (
    <div className="window-stage" data-contour-anchor="hero-panel" aria-label="Keystone macOS app preview">
      <section className="app-window" data-testid="keystone-window">
        <header className="window-toolbar">
          <div className="traffic-lights" data-testid="traffic-lights" aria-hidden>
            <span />
            <span />
            <span />
          </div>
          <div className="window-brand">
            <span className="window-brand-mark" aria-hidden>
              <KeystoneGlyph />
            </span>
            <span className="window-brand-name">Keystone</span>
            <span className="window-brand-divider" aria-hidden />
            <span className="window-brand-route">Dashboard</span>
          </div>
          <div className="toolbar-cluster">
            <ToolbarButton Icon={BarChartIcon} label="Charts" />
            <ToolbarButton Icon={RefreshIcon} label="Refresh" />
            <ToolbarButton Icon={SearchIcon} label="Search" />
            <button type="button" className="toolbar-menu" aria-label="View options" tabIndex={-1}>
              <MoreHorizIcon />
            </button>
          </div>
        </header>
        <div className="window-body">
          <AppSidebar />
          <main className="app-main dashboard-main">
            <div className="app-title-row">
              <div>
                <h2>Dashboard</h2>
                <p>Post-quantum cryptography benchmarking and quantum runtime workbench.</p>
              </div>
              <StatusBadge tone="ready">Ready</StatusBadge>
            </div>
            <QuickActions />
            <div className="dashboard-split">
              <RecentRuns />
              <EvidenceStatus />
            </div>
            <ToolsResources />
          </main>
        </div>
      </section>
    </div>
  );
}

function BenchmarkTable() {
  const fastest = Math.min(...BENCHMARKS.map((row) => row.ms));
  const floor = Math.log10(fastest) - 0.25;
  const ceiling = Math.log10(Math.max(...BENCHMARKS.map((row) => row.ms))) + 0.25;

  return (
    <div className="bench-table" data-testid="bench-table" aria-label="Sample benchmark, average milliseconds per operation">
      <div className="bench-row bench-head" aria-hidden>
        <span>Algorithm</span>
        <span>Avg time, log scale</span>
        <span>ms</span>
        <span>vs fastest</span>
      </div>
      {BENCHMARKS.map(({ name, detail, ms }) => {
        const width = ((Math.log10(ms) - floor) / (ceiling - floor)) * 100;
        const relative = ms / fastest;
        return (
          <div key={name} className="bench-row">
            <span className="bench-name">
              <strong>{name}</strong>
              <small>{detail}</small>
            </span>
            <span className="bench-bar">
              <i style={{ width: `${width.toFixed(1)}%` }} />
            </span>
            <span className="bench-time">{ms.toFixed(4)}</span>
            <span className="bench-rel">{relative < 1.05 ? "1.0×" : `${relative.toFixed(1)}×`}</span>
          </div>
        );
      })}
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
          <InterfaceContourField
            className="hero-contour-field"
            anchorSelector="[data-contour-anchor='hero-panel']"
          />
          <div className="container-page hero-grid">
            <div className="hero-lead">
              <h1>
                Post-quantum benchmarking, <span className="no-break">on your Mac.</span>
              </h1>
              <p>
                Keystone runs ML-KEM, ML-DSA, Falcon, and SPHINCS+ against classical baselines
                on your own hardware, and keeps the evidence.
              </p>
            </div>
            <KeystoneWindow />
          </div>
        </section>

        <section id="benchmarks" className="evidence-band">
          <div className="container-page">
            <SectionIndex index="01" label="Benchmarks" annotation="avg ms per op · 10,000 iterations" />
            <div className="band-head">
              <h2>Measured, not promised.</h2>
              <p>
                Four NIST post-quantum families, timed on the machine in front of you.
                Every figure below comes from a run you can reproduce.
              </p>
            </div>
            <BenchmarkTable />
            <div className="band-ledgers">
              <div className="ledger" aria-label="Algorithm coverage">
                <h3>Coverage</h3>
                <dl>
                  {COVERAGE.map(({ family, sets }) => (
                    <div key={family}>
                      <dt>{family}</dt>
                      <dd>{sets}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="ledger" aria-label="macOS package gates">
                <h3>Package gates</h3>
                <ol>
                  {RELEASE_GATES.map((gate) => (
                    <li key={gate}>{gate}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section id="local" className="local-section">
          <div className="container-page">
            <SectionIndex index="02" label="Local by design" annotation="evidence stays on the machine" />
            <div className="local-grid">
              <div className="local-copy">
                <h2>Not a cloud dashboard pretending to be cryptography.</h2>
                <div className="proof-ledger">
                  {PROOF_POINTS.map(({ title, body }) => (
                    <article key={title} data-testid="proof-card" className="proof-entry">
                      <h3>{title}</h3>
                      <p>{body}</p>
                    </article>
                  ))}
                </div>
                <Link href="/docs/" className="inline-link">
                  Read the docs
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <figure className="detail-frame">
                <EvidenceStatus />
                <figcaption>Evidence status, as it ships in v1.0.0</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section id="download" className="download-final" aria-label="Download">
          <div className="container-page">
            <SectionIndex index="03" label="Download" annotation="v1.0.0 · apple silicon" />
            <div className="download-stage">
              <span className="download-glyph" aria-hidden>
                <KeystoneGlyph />
              </span>
              <h2>Keystone for macOS.</h2>
              <p>
                Packaged through the five gates above. Windows and Linux follow on the same
                release path.
              </p>
              <div className="download-actions">
                <Link className="primary-action" href={GITHUB_URL} data-testid="download-macos">
                  <AppleLogo className="h-5 w-5" />
                  Download for macOS
                </Link>
                <Link className="secondary-action" href={GITHUB_URL}>
                  View on GitHub
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="about" role="contentinfo" className="site-footer">
        <div className="container-page footer-grid">
          <div>
            <BrandLink />
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
            <p>macOS available · Win/Linux on the release path</p>
          </div>
        </div>
        <div className="container-page footer-bottom">
          <span>© 2026 Keystone Labs Inc. All rights reserved.</span>
          <ThemeToggle />
          <span>
            <Link href="/terms/">Terms of Use</Link>
            <Link href="/privacy/">Privacy Policy</Link>
          </span>
        </div>
      </footer>
    </>
  );
}
