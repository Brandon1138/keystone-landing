import { Check } from "lucide-react";

import { KeystoneGlyph } from "@/components/landing/KeystoneGlyph";
import { type ReleaseManifest } from "@/lib/releases/manifest";

/* The artifact as a signed specimen: the real DMG, the facts a reviewer checks
   before running an unknown binary. The mark identifies the file; the checksum
   is select-all so one click grabs the whole digest. */
export function ReleaseRecord({ manifest }: { manifest: ReleaseManifest }) {
  const released = new Date(manifest.buildDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <figure className="release-record" aria-label="Signed release record">
      <figcaption className="release-record-head">
        <span className="release-record-mark" aria-hidden>
          <KeystoneGlyph />
        </span>
        <span className="release-record-file">
          <span className="release-record-kicker">Release record</span>
          <span className="release-record-name mono-data">{manifest.filename}</span>
        </span>
      </figcaption>
      <dl className="release-record-grid">
        <div>
          <dt>Version</dt>
          <dd className="mono-data">{manifest.version}</dd>
        </div>
        <div>
          <dt>Minimum macOS</dt>
          <dd className="mono-data">{manifest.minimumMacOS}+</dd>
        </div>
        <div>
          <dt>Signed</dt>
          <dd className="release-record-verified">
            <Check aria-hidden />
            Developer ID
          </dd>
        </div>
        <div>
          <dt>Notarized</dt>
          <dd className="release-record-verified">
            <Check aria-hidden />
            Apple
          </dd>
        </div>
        <div>
          <dt>Released</dt>
          <dd className="mono-data">{released}</dd>
        </div>
        <div>
          <dt>Verified macOS</dt>
          <dd className="release-record-verified">
            <Check aria-hidden />
            macOS {manifest.verifiedMacOS}
          </dd>
        </div>
        <div className="release-record-sum">
          <dt>SHA-256</dt>
          <dd className="release-record-hash mono-data" tabIndex={0}>
            {manifest.sha256}
          </dd>
        </div>
      </dl>
    </figure>
  );
}
