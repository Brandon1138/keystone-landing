import manifestJson from "@/content/releases/latest.json";
import {
  resolveReleaseState,
  validateReleaseManifest,
} from "@/lib/releases/manifest";

export const dynamic = "force-dynamic";

export async function GET() {
  // Gate on the full release state, not just manifest shape: a valid manifest
  // with no usable artifact origin must not advertise a live /download URL.
  const state = resolveReleaseState(
    validateReleaseManifest(manifestJson),
    process.env.KEYSTONE_ARTIFACT_BASE_URL,
  );

  if (!state.available) {
    return Response.json(
      { available: false },
      {
        status: 404,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  return Response.json(state.manifest, {
    headers: {
      "Cache-Control": "public, max-age=300, stale-while-revalidate=300",
    },
  });
}
