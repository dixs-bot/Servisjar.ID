// GET  /api/admin/orders/[id]  — fetch full order detail (admin)

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serializeOrder } from "@/lib/order";
import { verifySession, SESSION_COOKIE_NAME } from "@/lib/auth";

export const runtime = "nodejs";

function extractCookie(header: string, name: string): string | undefined {
  const parts = header.split(";");
  for (const p of parts) {
    const [k, ...v] = p.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return undefined;
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const cookieHeader = req.headers.get("cookie") || "";
  const token = extractCookie(cookieHeader, SESSION_COOKIE_NAME);
  if (!verifySession(token)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const order = await db.serviceOrder.findUnique({
    where: { id },
    include: {
      media: { orderBy: { createdAt: "asc" } },
      statusHistory: { orderBy: { createdAt: "desc" } },
      notes: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!order) {
    return NextResponse.json({ success: false, error: "Order tidak ditemukan" }, { status: 404 });
  }

  const serialized = await serializeOrder(order);
  return NextResponse.json({ success: true, data: serialized });
}
