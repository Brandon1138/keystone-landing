#!/usr/bin/env node

import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { readFile, stat, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";

const [artifactPath, version, minimumMacOS, verifiedMacOS, siteOrigin] =
  process.argv.slice(2);

if (
  !artifactPath ||
  !version ||
  !minimumMacOS ||
  !verifiedMacOS ||
  !siteOrigin
) {
  console.error(
    "usage: node scripts/create-release-manifest.mjs <artifact.dmg> <version> <minimum-macos> <verified-macos> <site-origin>",
  );
  process.exit(2);
}

const artifact = resolve(artifactPath);
const filename = basename(artifact);
const expectedFilename = `Keystone-${version}-macOS.dmg`;

if (filename !== expectedFilename) {
  throw new Error(
    `Expected filename ${expectedFilename}, received ${filename}`,
  );
}

function check(command, args) {
  return spawnSync(command, args, { encoding: "utf8" }).status === 0;
}

// Derive the security facts from the artifact itself; never assert them.
// These mirror the checks verify:release runs, so the manifest can only ever
// claim signing/notarization that this machine could actually confirm.
const signed =
  check("codesign", [
    "--verify",
    "--deep",
    "--strict",
    "--verbose=2",
    artifact,
  ]) && check("spctl", ["-a", "-vv", "-t", "install", artifact]);
const notarized = check("xcrun", ["stapler", "validate", artifact]);

if (!signed || !notarized) {
  console.error(
    `Refusing to write a manifest: the artifact is not verifiably ${
      signed ? "notarized" : "signed"
    }. The release boundary stays closed until the DMG passes codesign, spctl, and stapler.`,
  );
  process.exit(1);
}

const bytes = await readFile(artifact);
const metadata = await stat(artifact);
const manifest = {
  version,
  filename,
  sha256: createHash("sha256").update(bytes).digest("hex"),
  signed,
  notarized,
  buildDate: metadata.mtime.toISOString(),
  minimumMacOS,
  verifiedMacOS,
  downloadUrl: new URL("/download", siteOrigin).toString(),
};

await writeFile(
  resolve("content/releases/latest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
