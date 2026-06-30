import type { Metadata } from "next";
import Link from "next/link";

import { BrandLink } from "@/components/landing/BrandLink";
import { ReleaseRecord } from "@/components/landing/ReleaseRecord";
import { SectionIndex } from "@/components/landing/SectionIndex";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { SmartDownloadButton } from "@/components/landing/SmartDownloadButton";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import manifestJson from "@/content/releases/latest.json";
import { validateReleaseManifest } from "@/lib/releases/manifest";

const manifest = validateReleaseManifest(manifestJson);
const releasePublished = Boolean(manifest);

/* Nav anchors live on the landing page, so reference them absolutely; Releases
   is the page we're on. */
const NAV_LINKS = [
  { label: "Benchmarks", href: "/#benchmarks" },
  { label: "Quantum", href: "/#quantum" },
  { label: "Releases", href: "/releases/" },
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

export const metadata: Metadata = {
  title: "Releases",
  description:
    "The current public macOS build of Keystone: signed, notarized, stapled, and checksum-verified.",
  alternates: { canonical: "/releases" },
};

export default function ReleasesPage() {
  return (
    <>
      <SiteHeader
        links={NAV_LINKS}
        releaseAvailable={releasePublished}
        releaseVersion={manifest?.version}
        brand={<BrandLink />}
      />

      <main>
        <section className="download-final release-hero" aria-labelledby="releases-title">
          <div className="hero-measure-grid" aria-hidden />
          <div className="container-page">
            <SectionIndex
              index="01"
              label="Release"
              annotation={
                manifest ? `v${manifest.version} · apple silicon` : "apple silicon"
              }
            />
            <div className="release-grid">
              <div className="release-lede">
                <h1 id="releases-title">Releases</h1>
                <p>
                  {releasePublished
                    ? `Keystone ${manifest?.version} is the current public macOS build — signed with a Developer ID, notarized and stapled by Apple, and verified against the checksum on the right.`
                    : "Download stays closed until the DMG, manifest, checksum, signing, notarization, filename, version, and live response all agree."}
                </p>
                <div className="release-actions">
                  <SmartDownloadButton
                    available={releasePublished}
                    version={manifest?.version}
                    className="primary-action"
                  />
                  {manifest && (
                    <Link className="secondary-action" href="/releases/latest.json">
                      View manifest
                    </Link>
                  )}
                </div>
              </div>
              {manifest && <ReleaseRecord manifest={manifest} />}
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
