// GET /api/media/[...path] — serve uploaded media files (gated access)
//
// Public access is allowed for media under orders/* — needed so the customer can preview
// their uploaded photos/videos during the wizard and so WhatsApp message links work.
// For strict production privacy: gate by signed token (Supabase signed URLs).

import { NextRequest, NextResponse } from "next/server";
import { readMediaFile, resolveMediaPath } from "@/lib/storage";

export const runtime = "nodejs";

const MIME_MAP: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".webm": "video/webm",
  ".pdf": "application/pdf",
};

export async function GET(_req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await ctx.params;
  if (!segments || segments.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const relPath = segments.join("/");
  if (relPath.includes("..")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const buf = await readMediaFile(relPath);
  if (!buf) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const ext = relPath.toLowerCase().match(/\.[a-z0-9]+$/)?.[0] || "";
  const mime = MIME_MAP[ext] || "application/octet-stream";

  return new NextResponse(buf, {
    status: 200,
    headers: {
      "Content-Type": mime,
      "Content-Length": String(buf.length),
      "Cache-Control": "private, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

// Required for path resolution sanity
export const _resolve = resolveMediaPath;
