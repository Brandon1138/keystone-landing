#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile, stat, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";

const [artifactPath, version, minimumMacOS, siteOrigin] =
  process.argv.slice(2);

if (!artifactPath || !version || !minimumMacOS || !siteOrigin) {
  console.error(
    "usage: node scripts/create-release-manifest.mjs <artifact.dmg> <version> <minimum-macos> <site-origin>",
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

const bytes = await readFile(artifact);
const metadata = await stat(artifact);
const manifest = {
  version,
  filename,
  sha256: createHash("sha256").update(bytes).digest("hex"),
  signed: true,
  notarized: true,
  buildDate: metadata.mtime.toISOString(),
  minimumMacOS,
  downloadUrl: new URL("/download", siteOrigin).toString(),
};

await writeFile(
  resolve("content/releases/latest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
