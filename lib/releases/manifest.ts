export type ReleaseManifest = {
  version: string;
  filename: string;
  sha256: string;
  signed: true;
  notarized: true;
  buildDate: string;
  minimumMacOS: string;
  downloadUrl: string;
};

export type ReleaseState =
  | { available: false }
  | {
      available: true;
      manifest: ReleaseManifest;
      artifactUrl: string;
    };

const DEFAULT_SITE_ORIGIN = "https://keystone-landing-silk.vercel.app";
const SHA256 = /^[a-f0-9]{64}$/;
const VERSION = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
const DMG = /^Keystone-[0-9A-Za-z.-]+-macOS\.dmg$/;
const MACOS = /^\d+\.\d+$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}(?:T.*Z)?$/;

function siteOrigin() {
  return new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_ORIGIN,
  ).origin;
}

export function validateReleaseManifest(
  value: unknown,
): ReleaseManifest | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const manifest = value as Record<string, unknown>;
  if (
    typeof manifest.version !== "string" ||
    !VERSION.test(manifest.version) ||
    typeof manifest.filename !== "string" ||
    !DMG.test(manifest.filename) ||
    !manifest.filename.includes(manifest.version) ||
    typeof manifest.sha256 !== "string" ||
    !SHA256.test(manifest.sha256) ||
    manifest.signed !== true ||
    manifest.notarized !== true ||
    typeof manifest.buildDate !== "string" ||
    !ISO_DATE.test(manifest.buildDate) ||
    Number.isNaN(Date.parse(manifest.buildDate)) ||
    typeof manifest.minimumMacOS !== "string" ||
    !MACOS.test(manifest.minimumMacOS) ||
    typeof manifest.downloadUrl !== "string"
  ) {
    return null;
  }

  let downloadUrl: URL;
  try {
    downloadUrl = new URL(manifest.downloadUrl);
  } catch {
    return null;
  }

  if (
    downloadUrl.origin !== siteOrigin() ||
    downloadUrl.pathname !== "/download" ||
    downloadUrl.search ||
    downloadUrl.hash ||
    downloadUrl.username ||
    downloadUrl.password
  ) {
    return null;
  }

  return manifest as ReleaseManifest;
}

export function resolveReleaseState(
  manifest: ReleaseManifest | null,
  artifactBaseUrl: string | undefined,
): ReleaseState {
  if (!manifest || !artifactBaseUrl) return { available: false };

  let base: URL;
  try {
    base = new URL(
      artifactBaseUrl.endsWith("/") ? artifactBaseUrl : `${artifactBaseUrl}/`,
    );
  } catch {
    return { available: false };
  }

  const isGitHub =
    base.hostname === "github.com" || base.hostname.endsWith(".github.com");
  if (
    base.protocol !== "https:" ||
    isGitHub ||
    base.origin === new URL(manifest.downloadUrl).origin
  ) {
    return { available: false };
  }

  return {
    available: true,
    manifest,
    artifactUrl: new URL(manifest.filename, base).toString(),
  };
}
