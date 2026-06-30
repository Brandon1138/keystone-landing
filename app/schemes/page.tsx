import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";

import { BrandLink } from "@/components/landing/BrandLink";
import { SectionIndex } from "@/components/landing/SectionIndex";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import manifestJson from "@/content/releases/latest.json";
import { validateReleaseManifest } from "@/lib/releases/manifest";

const manifest = validateReleaseManifest(manifestJson);
const releasePublished = Boolean(manifest);

/* Nav anchors live on the landing page, so reference them absolutely; Schemes
   is the page we're on. */
const NAV_LINKS = [
  { label: "Benchmarks", href: "/#benchmarks" },
  { label: "Quantum", href: "/#quantum" },
  { label: "Schemes", href: "/schemes/" },
];

const FOOTER_GROUPS = [
  {
    heading: "Product",
    links: [
      ["Overview", "/#overview"],
      ["Benchmarks", "/#benchmarks"],
      ["Download", "/#download"],
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
    links: [["Contact", "/contact/"]],
  },
] as const;

type Tone = "broken" | "weakened" | "resistant";

type Scheme = {
  name: string;
  std: string;
  role: string;
  basis: string;
  status: { label: string; tone: Tone };
};

/* Four classical schemes rest on factoring and discrete logs — the structure
   Shor's algorithm dismantles — while AES only loses half its margin to Grover. */
const CLASSICAL: Scheme[] = [
  {
    name: "RSA",
    std: "public-key",
    role: "Encryption & signatures",
    basis: "Integer factoring",
    status: { label: "Broken · Shor's", tone: "broken" },
  },
  {
    name: "ECC",
    std: "ECDSA",
    role: "Signatures",
    basis: "Elliptic-curve discrete log",
    status: { label: "Broken · Shor's", tone: "broken" },
  },
  {
    name: "ECDH",
    std: "EC Diffie–Hellman",
    role: "Key exchange",
    basis: "Elliptic-curve discrete log",
    status: { label: "Broken · Shor's", tone: "broken" },
  },
  {
    name: "AES",
    std: "FIPS 197",
    role: "Symmetric cipher",
    basis: "Brute-force key search",
    status: { label: "Halved · Grover's", tone: "weakened" },
  },
];

/* Five post-quantum schemes rest on lattices, hashes, and codes — problems with
   no known efficient quantum attack. */
const POSTQUANTUM: Scheme[] = [
  {
    name: "Kyber",
    std: "ML-KEM · FIPS 203",
    role: "Key encapsulation",
    basis: "Module lattices (LWE)",
    status: { label: "Resistant", tone: "resistant" },
  },
  {
    name: "Dilithium",
    std: "ML-DSA · FIPS 204",
    role: "Signatures",
    basis: "Module lattices (SIS/LWE)",
    status: { label: "Resistant", tone: "resistant" },
  },
  {
    name: "Falcon",
    std: "FN-DSA",
    role: "Signatures",
    basis: "NTRU lattices",
    status: { label: "Resistant", tone: "resistant" },
  },
  {
    name: "SPHINCS+",
    std: "SLH-DSA · FIPS 205",
    role: "Signatures",
    basis: "Hash preimage resistance",
    status: { label: "Resistant", tone: "resistant" },
  },
  {
    name: "Classic McEliece",
    std: "round-4 KEM",
    role: "Key encapsulation",
    basis: "Syndrome decoding",
    status: { label: "Resistant", tone: "resistant" },
  },
];

const STATUS_ICON = {
  broken: ShieldX,
  weakened: ShieldAlert,
  resistant: ShieldCheck,
} as const;

function SchemeTable({ schemes }: { schemes: Scheme[] }) {
  return (
    <div className="scheme-table">
      <div className="scheme-row scheme-head" aria-hidden>
        <span>Scheme</span>
        <span>Role</span>
        <span>Hard problem</span>
        <span>Quantum status</span>
      </div>
      {schemes.map((scheme) => {
        const Icon = STATUS_ICON[scheme.status.tone];
        return (
          <div className="scheme-row" key={scheme.name}>
            <span className="scheme-name">
              <strong>{scheme.name}</strong>
              <small>{scheme.std}</small>
            </span>
            <span className="scheme-role">{scheme.role}</span>
            <span className="scheme-basis">{scheme.basis}</span>
            <span className="scheme-status" data-tone={scheme.status.tone}>
              <Icon aria-hidden />
              {scheme.status.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export const metadata: Metadata = {
  title: "Schemes",
  description:
    "The cryptosystems Keystone captures and the quantum algorithms that bear on them: classical schemes Shor's and Grover's threaten, and the post-quantum schemes that answer them.",
  alternates: { canonical: "/schemes" },
};

export default function SchemesPage() {
  return (
    <>
      <SiteHeader
        links={NAV_LINKS}
        releaseAvailable={releasePublished}
        releaseVersion={manifest?.version}
        brand={<BrandLink />}
      />

      <main>
        <section className="download-final schemes-hero" aria-labelledby="schemes-title">
          <div className="hero-measure-grid" aria-hidden />
          <div className="container-page">
            <SectionIndex index="01" label="Schemes" annotation="9 cryptosystems · 2 quantum attacks" />

            <div className="schemes-lede">
              <h1 id="schemes-title">The Field</h1>
              <p>
                Keystone captures nine cryptosystems across the line quantum computing
                draws through them. Four classical schemes rest on factoring and discrete
                logarithms — the structure Shor&rsquo;s algorithm dismantles. Five
                post-quantum schemes rest on lattices, hashes, and codes, where no
                efficient quantum attack is known.
              </p>
            </div>

            <div className="scheme-group">
              <div className="scheme-group-head">
                <h2>Classical</h2>
                <p>In wide use today, and the schemes a quantum computer is built to undo.</p>
              </div>
              <SchemeTable schemes={CLASSICAL} />
            </div>

            <div className="scheme-group">
              <div className="scheme-group-head">
                <h2>Post-quantum</h2>
                <p>The standardized and candidate replacements Keystone benchmarks against the classical baseline.</p>
              </div>
              <SchemeTable schemes={POSTQUANTUM} />
            </div>

            <div className="bqp-block">
              <SectionIndex index="02" label="Attacks" annotation="bounded-error quantum polynomial time" />
              <div className="bqp-grid">
                <article className="bqp-card">
                  <span className="bqp-kicker">BQP · polynomial time</span>
                  <h3>Shor&rsquo;s Algorithm</h3>
                  <p>
                    Factors integers and solves discrete logarithms in polynomial time —
                    the exact hardness RSA, ECC, and ECDH are built on.
                  </p>
                  <p className="bqp-targets">
                    <span>Ends</span>
                    <code>RSA</code>
                    <code>ECC</code>
                    <code>ECDH</code>
                  </p>
                </article>
                <article className="bqp-card">
                  <span className="bqp-kicker">BQP · quadratic speedup</span>
                  <h3>Grover&rsquo;s Algorithm</h3>
                  <p>
                    Searches unstructured space in roughly the square root of the steps,
                    halving the effective strength of a symmetric or hash-based key.
                  </p>
                  <p className="bqp-targets">
                    <span>Halves</span>
                    <code>AES</code>
                    <code>hash strength</code>
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer role="contentinfo" className="site-footer">
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
