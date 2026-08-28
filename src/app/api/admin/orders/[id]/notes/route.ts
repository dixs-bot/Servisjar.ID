// POST /api/admin/orders/[id]/notes — add a service note

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifySession, SESSION_COOKIE_NAME } from "@/lib/auth";
import { noteSchema } from "@/lib/validation";

export const runtime = "nodejs";

function extractCookie(header: string, name: string): string | undefined {
  const parts = header.split(";");
  for (const p of parts) {
    const [k, ...v] = p.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return undefined;
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const cookieHeader = req.headers.get("cookie") || "";
  const token = extractCookie(cookieHeader, SESSION_COOKIE_NAME);
  if (!verifySession(token)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const body = await req.json();
  const parsed = noteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Input tidak valid" },
      { status: 400 }
    );
  }

  const order = await db.serviceOrder.findUnique({ where: { id }, select: { id: true } });
  if (!order) {
    return NextResponse.json({ success: false, error: "Order tidak ditemukan" }, { status: 404 });
  }

  const note = await db.serviceNote.create({
    data: {
      orderId: id,
      note: parsed.data.note,
      noteType: parsed.data.noteType,
    },
  });

  return NextResponse.json({ success: true, data: note }, { status: 201 });
}
