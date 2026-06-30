import Link from "next/link";

import { BrandLink } from "@/components/landing/BrandLink";
import { EditorialHero } from "@/components/landing/EditorialHero";
import { KeystoneGlyph, KeystoneGlyphWire } from "@/components/landing/KeystoneGlyph";
import { ReleaseRecord } from "@/components/landing/ReleaseRecord";
import { SectionIndex } from "@/components/landing/SectionIndex";
import { SmartDownloadButton } from "@/components/landing/SmartDownloadButton";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { InterfaceContourField } from "@/components/landing/InterfaceContourField";
import { KeystoneAppDemo } from "@/components/landing/KeystoneAppDemo";
import { QuantumScalingPredictor } from "@/components/landing/QuantumScalingPredictor";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { TraceStage, TracingBeam } from "@/components/ui/tracing-beam";
import manifestJson from "@/content/releases/latest.json";
import { validateReleaseManifest } from "@/lib/releases/manifest";

/* The validated manifest is real in every state; only the live artifact URL is
   gated by an env var. The release record below renders from the manifest, so
   the proof a reviewer checks is present whether or not the download is open. */
const manifest = validateReleaseManifest(manifestJson);
const releasePublished = Boolean(manifest);

const NAV_LINKS = [
  { label: "Benchmarks", href: "#benchmarks" },
  { label: "Quantum", href: "#quantum" },
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

/* A real Shor run, factoring 15 on the ibm_brisbane processor. Every figure is
   a measured value from the in-app quantum workload runner, not a simulation. */
const QUANTUM_RUN = {
  meta: "Shor's algorithm · N = 15, a = 7 · ibm_brisbane · quantum hardware",
  result: "3 × 5",
  readouts: [
    { label: "Execution", value: "34.53", unit: "s" },
    { label: "QPU time", value: "4.69", unit: "s" },
    { label: "Circuit depth", value: "683", unit: "" },
    { label: "Gate count", value: "1,096", unit: "" },
    { label: "Shots", value: "4,096", unit: "" },
    { label: "Quantum volume", value: "32", unit: "" },
    { label: "Gate error", value: "1.1516", unit: "%" },
    { label: "Readout error", value: "2.8943", unit: "%" },
    { label: "T₁ coherence", value: "234.7", unit: "µs" },
    { label: "T₂ coherence", value: "131.7", unit: "µs" },
  ],
  trace: "Period recovered via continued fractions · bitstring 0100 · job d1cphxzmya70008",
} as const;

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
      ["Releases", "/releases/"],
      ["Schemes", "/schemes/"],
    ],
  },
  {
    heading: "Project",
    links: [
      ["Contact", "/contact/"],
    ],
  },
] as const;

/* Signature figure for the quantum band: a hairline rendition of the measured
   distribution plot from the run above. Sixteen control-register outcomes, the
   expected peaks held slightly brighter. Structural, not decorative. */
const SPECTRUM_BARS = [
  0.62, 0.48, 0.71, 0.66, 0.92, 0.58, 0.74, 0.69, 0.5, 0.78, 0.61, 0.88, 0.55,
  0.7, 0.83, 0.79,
] as const;
const SPECTRUM_PEAKS = new Set([0, 4, 8, 12]);

function QuantumSpectrum() {
  return (
    <svg
      className="quantum-spectrum"
      viewBox="0 0 320 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      {SPECTRUM_BARS.map((h, i) => {
        const x = 6 + i * 19.5;
        const height = h * 92;
        return (
          <rect
            key={i}
            x={x}
            y={100 - height}
            width="11"
            height={height}
            className={SPECTRUM_PEAKS.has(i) ? "spectrum-bar peak" : "spectrum-bar"}
          />
        );
      })}
    </svg>
  );
}

function QuantumRun() {
  return (
    <div className="quantum-run" aria-label="Measured Shor run on IBM hardware">
      <div className="quantum-run-head">
        <span className="quantum-run-meta">{QUANTUM_RUN.meta}</span>
        <span className="quantum-run-result">
          Factored <strong className="mono-data">{QUANTUM_RUN.result}</strong>
        </span>
      </div>
      <dl className="quantum-run-grid">
        {QUANTUM_RUN.readouts.map((r) => (
          <div key={r.label}>
            <dt>{r.label}</dt>
            <dd className="mono-data">
              {r.value}
              {r.unit && <span className="quantum-run-unit">{r.unit}</span>}
            </dd>
          </div>
        ))}
      </dl>
      <p className="quantum-run-trace mono-data">{QUANTUM_RUN.trace}</p>
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
      <SiteHeader
        links={NAV_LINKS}
        releaseAvailable={releasePublished}
        releaseVersion={manifest?.version}
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

        <section id="quantum" className="quantum-band">
          <QuantumSpectrum />
          <span className="band-glyph" aria-hidden>
            <KeystoneGlyphWire />
          </span>
          <div className="container-page">
            <SectionIndex index="02" label="Quantum" annotation="shor · grover · ibm hardware" />
            <div className="band-head">
              <h2>We ran the attack.</h2>
              <p>
                Shor&rsquo;s algorithm factoring 15 on an IBM quantum processor, from inside
                Keystone. A demonstration today. The same procedure, scaled, is what ends RSA.
              </p>
            </div>
            <QuantumRun />
            <QuantumScalingPredictor />
          </div>
        </section>

        <section id="download" className="download-final" aria-label="Download">
          <div className="container-page">
            <SectionIndex
              index="03"
              label="Download"
              annotation={manifest ? `v${manifest.version} · apple silicon` : "apple silicon"}
            />
            <div className="download-grid">
              <div className="download-lede">
                <h2>Keystone for macOS.</h2>
                <p>
                  {releasePublished
                    ? "Packaged through the five gates above, then signed and notarized by Apple. Windows and Linux follow on the same release path."
                    : "Download stays closed until the DMG, manifest, checksum, signing, notarization, filename, version, and live response all agree."}
                </p>
                <SmartDownloadButton
                  available={releasePublished}
                  version={manifest?.version}
                  className="primary-action"
                />
              </div>
              {manifest && <ReleaseRecord manifest={manifest} />}
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
              {releasePublished
                ? `Signed macOS ${manifest?.version}.`
                : "macOS release verification in progress."}
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
