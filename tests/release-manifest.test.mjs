import assert from "node:assert/strict";
import test from "node:test";
import {
  resolveReleaseState,
  validateReleaseManifest,
} from "../lib/releases/manifest.ts";

const valid = {
  version: "1.0.0-beta.1",
  filename: "Keystone-1.0.0-beta.1-macOS.dmg",
  sha256: "a".repeat(64),
  signed: true,
  notarized: true,
  buildDate: "2026-06-12",
  minimumMacOS: "13.0",
  verifiedMacOS: "27",
  downloadUrl: "https://keystone-landing-silk.vercel.app/download",
};

test("accepts a complete release manifest", () => {
  assert.deepEqual(validateReleaseManifest(valid), valid);
});

test("rejects a release with incomplete verification", () => {
  assert.equal(validateReleaseManifest({ ...valid, notarized: false }), null);
});

test("rejects GitHub and non-first-party download URLs", () => {
  assert.equal(
    validateReleaseManifest({
      ...valid,
      downloadUrl: "https://github.com/Brandon1138/keystone/releases",
    }),
    null,
  );
});

test("is unavailable without a verified manifest and artifact origin", () => {
  assert.deepEqual(resolveReleaseState(null, undefined), { available: false });
});

test("builds the artifact URL from the separate origin and exact filename", () => {
  assert.deepEqual(
    resolveReleaseState(valid, "https://artifacts.example/keystone"),
    {
      available: true,
      manifest: valid,
      artifactUrl:
        "https://artifacts.example/keystone/Keystone-1.0.0-beta.1-macOS.dmg",
    },
  );
});

test("rejects GitHub as an artifact origin", () => {
  assert.deepEqual(
    resolveReleaseState(valid, "https://github.com/Brandon1138/keystone"),
    { available: false },
  );
});
