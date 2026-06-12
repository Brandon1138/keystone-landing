import manifestJson from "@/content/releases/latest.json";
import { validateReleaseManifest } from "@/lib/releases/manifest";

export const dynamic = "force-dynamic";

export async function GET() {
  const manifest = validateReleaseManifest(manifestJson);
  if (!manifest) {
    return Response.json(
      { available: false },
      {
        status: 404,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  return Response.json(manifest, {
    headers: {
      "Cache-Control": "public, max-age=300, stale-while-revalidate=300",
    },
  });
}
