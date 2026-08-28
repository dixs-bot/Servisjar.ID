// GET    /api/orders/[id] — fetch single order (admin only — requires session)
//        Accepts ?orderNumber=JARVIS-... for public lookup after submission

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serializeOrder } from "@/lib/order";
import { verifySession, SESSION_COOKIE_NAME } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const url = new URL(req.url);
  const orderNumberParam = url.searchParams.get("orderNumber");

  // Allow public lookup by orderNumber (so customer can view their own success page)
  // but full media/notes/history only available to admin.
  const cookieHeader = req.headers.get("cookie") || "";
  const token = extractCookie(cookieHeader, SESSION_COOKIE_NAME);
  const isAdmin = !!verifySession(token);

  try {
    let order = null;
    if (id && id !== "by-number") {
      order = await db.serviceOrder.findUnique({
        where: { id },
        include: {
          media: { orderBy: { createdAt: "asc" } },
          statusHistory: { orderBy: { createdAt: "desc" } },
          notes: { orderBy: { createdAt: "desc" } },
        },
      });
    } else if (orderNumberParam) {
      order = await db.serviceOrder.findUnique({
        where: { orderNumber: orderNumberParam },
        include: {
          media: { orderBy: { createdAt: "asc" } },
          statusHistory: { orderBy: { createdAt: "desc" } },
          notes: { orderBy: { createdAt: "desc" } },
        },
      });
    }

    if (!order) {
      return NextResponse.json({ success: false, error: "Order tidak ditemukan" }, { status: 404 });
    }

    // Public: return limited info (no media URLs visible to non-admin)
    if (!isAdmin) {
      const serialized = await serializeOrder(order);
      // Mask media URLs for non-admin (still show counts)
      const photos = serialized.media.filter((m) => m.fileType === "DAMAGE_PHOTO").length;
      const videos = serialized.media.filter((m) => m.fileType === "DAMAGE_VIDEO").length;
      const paymentProof = serialized.media.filter((m) => m.fileType === "PAYMENT_PROOF").length;
      return NextResponse.json({
        success: true,
        data: {
          orderNumber: serialized.orderNumber,
          customerName: serialized.customerName,
          orderStatus: serialized.orderStatus,
          paymentStatus: serialized.paymentStatus,
          paymentMethod: serialized.paymentMethod,
          serviceArea: serialized.serviceArea,
          mediaCounts: { photos, videos, paymentProof },
          createdAt: serialized.createdAt,
        },
      });
    }

    const serialized = await serializeOrder(order);
    return NextResponse.json({ success: true, data: serialized });
  } catch (err) {
    console.error("[GET /api/orders/[id]] error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

function extractCookie(header: string, name: string): string | undefined {
  const parts = header.split(";");
  for (const p of parts) {
    const [k, ...v] = p.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return undefined;
}
