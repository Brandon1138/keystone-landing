import manifestJson from "@/content/releases/latest.json";
import {
  resolveReleaseState,
  validateReleaseManifest,
} from "@/lib/releases/manifest";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = resolveReleaseState(
    validateReleaseManifest(manifestJson),
    process.env.KEYSTONE_ARTIFACT_BASE_URL,
  );

  if (!state.available) {
    return Response.json(
      {
        available: false,
        message: "The artifact origin is not configured for this environment.",
      },
      {
        status: 404,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  return Response.redirect(state.artifactUrl, 307);
}
