// PATCH /api/admin/orders/[id]/status — update order status / payment status
// Creates an entry in order_status_history when status changes.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serializeOrder } from "@/lib/order";
import { verifySession, SESSION_COOKIE_NAME } from "@/lib/auth";
import { statusUpdateSchema } from "@/lib/validation";

export const runtime = "nodejs";

function extractCookie(header: string, name: string): string | undefined {
  const parts = header.split(";");
  for (const p of parts) {
    const [k, ...v] = p.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return undefined;
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const cookieHeader = req.headers.get("cookie") || "";
  const token = extractCookie(cookieHeader, SESSION_COOKIE_NAME);
  if (!verifySession(token)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const body = await req.json();
  const parsed = statusUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Input tidak valid" },
      { status: 400 }
    );
  }
  const d = parsed.data;

  const order = await db.serviceOrder.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json({ success: false, error: "Order tidak ditemukan" }, { status: 404 });
  }

  const oldStatus = order.orderStatus;
  const oldPayment = order.paymentStatus;

  const updated = await db.serviceOrder.update({
    where: { id },
    data: {
      orderStatus: d.orderStatus,
      paymentStatus: d.paymentStatus ?? oldPayment,
    },
    include: {
      media: { orderBy: { createdAt: "asc" } },
      statusHistory: { orderBy: { createdAt: "desc" } },
      notes: { orderBy: { createdAt: "desc" } },
    },
  });

  // Status history entry (if changed)
  if (oldStatus !== d.orderStatus) {
    await db.orderStatusHistory.create({
      data: {
        orderId: id,
        oldStatus,
        newStatus: d.orderStatus,
        note: d.note || `Status diubah dari ${oldStatus} ke ${d.orderStatus}`,
      },
    });
  }
  // Payment history entry (if changed)
  if (d.paymentStatus && d.paymentStatus !== oldPayment) {
    await db.orderStatusHistory.create({
      data: {
        orderId: id,
        oldStatus: oldPayment,
        newStatus: d.paymentStatus,
        note: d.note || `Pembayaran diubah dari ${oldPayment} ke ${d.paymentStatus}`,
      },
    });
  }

  // Re-fetch with history
  const refreshed = await db.serviceOrder.findUnique({
    where: { id },
    include: {
      media: { orderBy: { createdAt: "asc" } },
      statusHistory: { orderBy: { createdAt: "desc" } },
      notes: { orderBy: { createdAt: "desc" } },
    },
  });
  const serialized = await serializeOrder(refreshed || updated);
  return NextResponse.json({ success: true, data: serialized });
}
