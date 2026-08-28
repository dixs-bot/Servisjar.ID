// GET  /api/admin/orders  — list orders (admin)
// GET  /api/admin/orders?status=&payment=&search=

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

export async function GET(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") || "";
  const token = extractCookie(cookieHeader, SESSION_COOKIE_NAME);
  if (!verifySession(token)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const payment = url.searchParams.get("payment");
  const search = url.searchParams.get("search");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "200"), 500);

  const where: Record<string, unknown> = {};
  if (status) where.orderStatus = status;
  if (payment) where.paymentStatus = payment;
  if (search) {
    where.OR = [
      { orderNumber: { contains: search } },
      { customerName: { contains: search } },
      { customerPhone: { contains: search } },
      { customerCity: { contains: search } },
      { deviceBrand: { contains: search } },
      { deviceModel: { contains: search } },
    ];
  }

  const orders = await db.serviceOrder.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { media: true },
  });

  const serialized = await Promise.all(orders.map((o) => serializeOrder(o)));
  return NextResponse.json({ success: true, data: serialized });
}
