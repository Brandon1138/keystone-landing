import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EditorialHero } from "@/components/landing/EditorialHero";
import { SmartDownloadButton } from "@/components/landing/SmartDownloadButton";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { InterfaceContourField } from "@/components/landing/InterfaceContourField";
import { KeystoneAppDemo } from "@/components/landing/KeystoneAppDemo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { TraceStage, TracingBeam } from "@/components/ui/tracing-beam";
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
    heading: "Project",
    links: [
      ["Case study", "https://mikoshi.studio/cases/keystone"],
      ["Security", "/security/"],
      ["Contact", "/contact/"],
      ["Documentation", "/docs/"],
    ],
  },
] as const;

/* Official mark facets. `accent` is the blue keystone face; the rest render
   in the current ink at descending opacity. */
const GLYPH_FACETS: { d: string; accent?: boolean; opacity?: number }[] = [
  {
    d: "M499.1,167.499C499.109,171.304 499.105,251.245 500.046,291.497C500.146,295.738 497.99,294.817 437.439,330.395C343.908,385.351 341.923,383.579 337.715,391.622C333.598,399.492 335.224,408.164 335.03,533.498C335.008,548.045 334.892,547.963 335.041,562.5C335.232,581.021 335.269,581.459 333.518,582.528C324.983,587.734 204.738,657.756 201.637,659.791C198.44,661.89 199.198,657.135 198.527,646.498C198.229,641.792 198.426,363.14 198.443,338.5C198.461,313.151 198.859,307.114 221.301,295.155C231.518,289.712 231.167,289.235 279.749,260.942C496.78,134.548 498.134,132.401 499.052,134.671C499.088,134.758 499.099,164.873 499.1,167.499Z",
    opacity: 0.95,
  },
  {
    d: "M823.89,321.46C824.527,329.656 823.985,539.618 824.173,576.503C824.177,577.22 824.216,584.927 823.463,585.437C821.844,586.534 707.402,520.1 701.254,516.225C697.51,513.865 690.327,509.803 690.327,509.803C690.327,509.803 691.742,401.605 689.091,392.624C686.564,384.062 684.909,384.473 605.67,339.208C531.227,296.682 531.113,296.971 524.783,293.042C522.49,291.619 524.099,290.691 523.839,206.497C523.642,142.943 523.258,143.014 523.255,137.494C523.253,134.78 523.116,133.287 525.534,134.412C530.228,136.595 735.595,255.11 746.781,262.031C778.027,281.361 778.962,279.632 810.226,298.96C822.333,306.444 823.657,320.245 823.89,321.46Z",
    accent: true,
  },
  {
    d: "M244.452,699.579C216.357,683.293 216.142,683.749 213.785,682.2C212.29,681.217 214.562,679.947 214.739,679.848C239.343,666.085 305.443,626.485 322.266,617.072C341.588,606.262 345.393,598.962 363.201,609.96C369.206,613.668 480.979,676.243 491.234,681.984C514.189,694.835 520.086,688.413 535.66,679.782C539.562,677.62 606.122,639.029 609.583,637.776C611.285,637.16 611.473,637.44 629.625,648.271C642.472,655.937 656.424,663.703 658.774,665.01C665.875,668.962 746.513,713.843 747.456,714.549C749.217,715.867 747.291,716.488 709.739,738.875C678.818,757.309 678.906,757.41 676.215,759.005C666.619,764.691 559.115,828.392 556.247,830.05C527.241,846.826 522.47,851.135 506.462,848.829C495.342,847.228 496.006,845.224 410.325,795.811C358.061,765.67 265.064,710.957 244.452,699.579Z",
    opacity: 0.35,
  },
  {
    d: "M644.666,627.207C639.663,624.264 639.351,624.369 639.359,623.497C639.368,622.427 675.676,602.796 678.511,602.884C682.239,602.999 762.062,649.933 794.298,666.906C812.609,676.547 813.113,676.911 812.673,678.597C812.623,678.789 775.918,700.597 774.517,700.691C772.22,700.845 667.085,639.601 644.666,627.207Z",
    opacity: 0.25,
  },
  {
    d: "M824.626,632.499C824.638,651.974 825.456,656.936 822.312,654.902C822.231,654.849 713.298,593.03 695.683,584.134C688.85,580.683 690.37,579.107 690.35,571.499C690.275,542.667 689.635,539.183 692.459,540.604C692.463,540.607 805.486,603.354 815.314,608.811C820.067,611.449 824.752,613.25 824.83,615.467C824.878,616.829 824.978,619.627 824.626,632.499Z",
    opacity: 0.25,
  },
];

function KeystoneGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1024 1024" aria-hidden className={className} style={{ overflow: "visible" }}>
      <g transform="translate(512, 512) scale(1.1)">
        <g transform="translate(-512, -512)">
          {GLYPH_FACETS.map(({ d, accent, opacity }) => (
            <path
              key={d.slice(0, 24)}
              d={d}
              fill={accent ? "var(--color-primary)" : "currentColor"}
              opacity={opacity}
            />
          ))}
        </g>
      </g>
    </svg>
  );
}

/* Blueprint rendition of the mark: the same facets traced as hairlines,
   used as a structural background figure rather than a logo. */
function KeystoneGlyphWire({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1024 1024" aria-hidden className={className}>
      {GLYPH_FACETS.map(({ d, accent }) => (
        <path
          key={d.slice(0, 24)}
          d={d}
          fill="none"
          className={accent ? "wire-accent" : "wire-ink"}
          strokeWidth="2.25"
          strokeLinejoin="round"
        />
      ))}
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

const EVIDENCE_CHAIN_STAGES = [
  {
    index: "01",
    eyebrow: "Local execution",
    caption: "Runs on this Mac. Nothing leaves the machine.",
    status: "Run executing",
    rows: [
      ["Execution", "Local process"],
      ["Transfer", "None"],
    ],
  },
  {
    index: "02",
    eyebrow: "Parameter evidence",
    caption: "The conditions are captured with the result.",
    status: "Record captured",
    rows: [
      ["Scheme", "ML-KEM-768"],
      ["Iterations", "10,000"],
      ["Average / op", "0.0060 ms"],
    ],
  },
  {
    index: "03",
    eyebrow: "Exportable report",
    caption: "Sealed into evidence a reviewer can inspect.",
    status: "Integrity verified",
    rows: [
      ["Integrity checks", "2 passed"],
      ["Review state", "Export ready"],
    ],
  },
] as const;

const EVIDENCE_FINGERPRINT = "7F3A · 91C2 · B84E";

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
      <SiteHeader
        links={NAV_LINKS}
        releaseAvailable={release.available}
        releaseVersion={release.available ? release.manifest.version : undefined}
        brand={<BrandLink />}
      />

      <main>
        <section id="overview" className="hero-section">
          <InterfaceContourField
            className="hero-contour-field"
            anchorSelector="[data-contour-anchor='hero-title']"
            variant="benchmark"
          />
          <div className="hero-measure-grid" aria-hidden />
          <div className="container-page hero-grid">
            <EditorialHero />
          </div>
          <ContainerScroll>
            <KeystoneAppDemo brandMark={<KeystoneGlyph />} />
          </ContainerScroll>
        </section>

        <section id="benchmarks" className="evidence-band">
          <span className="band-glyph" aria-hidden>
            <KeystoneGlyphWire />
          </span>
          <div className="container-page">
            <SectionIndex index="01" label="Benchmarks" annotation="avg ms per op · 10,000 iterations" />
            <div className="band-head">
              <h2>Measured, not promised.</h2>
              <p>
                Four NIST post-quantum families, timed on the machine in front of you.
                Every figure below comes from a run you can reproduce.
              </p>
            </div>
            <TracingBeam>
              <TraceStage index="01" label="Measure">
                <BenchmarkTable />
              </TraceStage>
              <div className="band-ledgers">
                <TraceStage index="02" label="Cover" className="ledger" >
                  <div aria-label="Algorithm coverage">
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
                </TraceStage>
                <TraceStage index="03" label="Verify" className="ledger trace-stage-verify">
                  <div aria-label="macOS package gates">
                    <h3>Package gates</h3>
                    <ol>
                      {RELEASE_GATES.map((gate) => (
                        <li key={gate}>{gate}</li>
                      ))}
                    </ol>
                  </div>
                </TraceStage>
              </div>
            </TracingBeam>
          </div>
        </section>

        <section id="local" className="local-section">
          <div className="container-page">
            <SectionIndex index="02" label="Local by design" annotation="evidence stays on the machine" />
            <div className="local-copy">
              <h2>Not a cloud dashboard pretending to be cryptography.</h2>
            </div>
            <StickyScroll
              content={PROOF_POINTS.map(({ title, body }) => ({
                title,
                description: body,
              }))}
              stages={EVIDENCE_CHAIN_STAGES}
              fingerprint={EVIDENCE_FINGERPRINT}
            />
            <Link href="/docs/" className="inline-link">
              Read the docs
              <ArrowRight className="h-4 w-4" />
            </Link>
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
                {release.available
                  ? "Packaged through the five gates above. Windows and Linux follow on the same release path."
                  : "Download stays closed until the DMG, manifest, checksum, signing, notarization, filename, version, and live response all agree."}
              </p>
              <div className="download-actions">
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
            </div>
          </div>
        </section>
      </main>

      <footer id="about" role="contentinfo" className="site-footer">
        <div className="container-page footer-grid">
          <div>
            <BrandLink />
            <p className="footer-lockup">Post-quantum cryptography &amp; benchmarking platform</p>
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
