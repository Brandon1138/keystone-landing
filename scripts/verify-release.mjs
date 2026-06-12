#!/usr/bin/env node

import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";

const [
  manifestPath,
  artifactPath,
  reportPath = "work/audit/keystone-release-verification.json",
] = process.argv.slice(2);

if (!manifestPath || !artifactPath) {
  console.error(
    "usage: node scripts/verify-release.mjs <manifest.json> <artifact.dmg> [report.json]",
  );
  process.exit(2);
}

function check(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8" });
  return {
    ok: result.status === 0,
    output: `${result.stdout ?? ""}${result.stderr ?? ""}`.trim(),
  };
}

function hash(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

async function verify() {
  const manifest = JSON.parse(await readFile(resolve(manifestPath), "utf8"));
  const artifact = resolve(artifactPath);
  const artifactBytes = await readFile(artifact);
  const digest = hash(artifactBytes);

  const filename = basename(artifact) === manifest.filename;
  const version =
    typeof manifest.version === "string" &&
    manifest.filename.includes(manifest.version);
  const checksum = digest === manifest.sha256;
  const signing = check("codesign", [
    "--verify",
    "--deep",
    "--strict",
    "--verbose=2",
    artifact,
  ]);
  const gatekeeper = check("spctl", ["-a", "-vv", "-t", "install", artifact]);
  const notarization = check("xcrun", ["stapler", "validate", artifact]);

  const responseDirectory = await mkdtemp(
    join(tmpdir(), "keystone-release-"),
  );
  const responseArtifact = join(responseDirectory, manifest.filename);
  const response = check("curl", [
    "-fsSL",
    manifest.downloadUrl,
    "-o",
    responseArtifact,
    "-w",
    "%{url_effective}",
  ]);

  let responseChecksum = "";
  if (response.ok) {
    responseChecksum = hash(await readFile(responseArtifact));
  }

  return {
    artifact: true,
    manifest: true,
    checksum,
    filename,
    version,
    signed: manifest.signed === true && signing.ok && gatekeeper.ok,
    notarized: manifest.notarized === true && notarization.ok,
    minimumMacOS:
      typeof manifest.minimumMacOS === "string" &&
      /^\d+\.\d+$/.test(manifest.minimumMacOS),
    response: response.ok && responseChecksum === manifest.sha256,
    sourceArchivesExposed: /github\.com\/.*\/archive\/refs/.test(
      response.output,
    ),
    privateRepositoryExposed:
      /github\.com\/Brandon1138\/keystone(?:\/|$)/.test(response.output),
    details: { signing, gatekeeper, notarization, response },
  };
}

let report;
try {
  report = await verify();
} catch (error) {
  report = {
    artifact: false,
    manifest: false,
    checksum: false,
    filename: false,
    version: false,
    signed: false,
    notarized: false,
    minimumMacOS: false,
    response: false,
    sourceArchivesExposed: false,
    privateRepositoryExposed: false,
    details: {
      error: error instanceof Error ? error.message : String(error),
    },
  };
}

await mkdir(dirname(resolve(reportPath)), { recursive: true });
await writeFile(resolve(reportPath), `${JSON.stringify(report, null, 2)}\n`);

const passed =
  report.artifact &&
  report.manifest &&
  report.checksum &&
  report.filename &&
  report.version &&
  report.signed &&
  report.notarized &&
  report.minimumMacOS &&
  report.response &&
  !report.sourceArchivesExposed &&
  !report.privateRepositoryExposed;

if (!passed) process.exit(1);
