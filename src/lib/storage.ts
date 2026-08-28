// JARVIS.ID — Storage abstraction
//
// Sandbox demo: stores files on local disk under /home/z/my-project/db/uploads/
// and serves them via /api/media/[...path] route with a simple token gate.
//
// Production (Supabase): replace these functions with Supabase Storage calls
// (upload → bucket `service-media`, folder structure orders/{order_id}/{photos|videos|payment}/).
// The spec requires private bucket + signed URLs; see supabase/schema.sql.

import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const UPLOAD_ROOT = path.join(process.cwd(), "db", "uploads");

export interface StoredFile {
  filePath: string; // relative to UPLOAD_ROOT, e.g. orders/<orderId>/photos/abc.jpg
  fileUrl: string; // served URL
  mimeType: string;
  fileSize: number;
  fileName: string;
}

export async function storeFile(
  file: File | Buffer,
  opts: { orderId: string; kind: "photos" | "videos" | "payment"; originalName: string; mimeType: string }
): Promise<StoredFile> {
  const { orderId, kind, originalName, mimeType } = opts;
  const dir = path.join(UPLOAD_ROOT, "orders", orderId, kind);
  await fs.mkdir(dir, { recursive: true });

  // Sanitize + unique name
  const ext = path.extname(originalName).toLowerCase().replace(/[^a-z0-9.]/g, "");
  const safeExt = ext || mimeToExt(mimeType);
  const unique = crypto.randomBytes(8).toString("hex");
  const fileName = `${unique}${safeExt}`;
  const fullPath = path.join(dir, fileName);
  const relPath = path.join("orders", orderId, kind, fileName).split(path.sep).join("/");

  const buffer =
    file instanceof File ? Buffer.from(await file.arrayBuffer()) : (file as Buffer);
  await fs.writeFile(fullPath, buffer);

  // URL — served via /api/media/[...path] with token gate for privacy
  const fileUrl = `/api/media/${relPath}`;

  return {
    filePath: relPath,
    fileUrl,
    mimeType,
    fileSize: buffer.length,
    fileName: originalName,
  };
}

export async function readMediaFile(relPath: string): Promise<Buffer | null> {
  try {
    const fullPath = resolveMediaPath(relPath);
    return await fs.readFile(fullPath);
  } catch {
    return null;
  }
}

export function resolveMediaPath(relPath: string): string {
  // Prevent path traversal
  const clean = relPath.replace(/\.\./g, "").replace(/^\/+/, "");
  return path.join(UPLOAD_ROOT, clean);
}

export async function deleteMediaFile(relPath: string): Promise<void> {
  try {
    const fullPath = resolveMediaPath(relPath);
    await fs.unlink(fullPath);
  } catch {
    // ignore
  }
}

function mimeToExt(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "video/mp4": ".mp4",
    "video/quicktime": ".mov",
    "video/webm": ".webm",
    "application/pdf": ".pdf",
  };
  return map[mime] ?? ".bin";
}
