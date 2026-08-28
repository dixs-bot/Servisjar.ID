// POST /api/orders — create a new service order (public)
// GET  /api/orders — list orders (admin only — requires session)

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orderSchema } from "@/lib/validation";
import { generateOrderNumber, serializeOrder } from "@/lib/order";
import { verifySession, SESSION_COOKIE_NAME } from "@/lib/auth";
import { ORDER_STATUS, PAYMENT_STATUS } from "@/lib/constants";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }
    const d = parsed.data;

    // Validate service selection — at least one
    if (d.softwareServices.length === 0 && d.hardwareServices.length === 0) {
      return NextResponse.json(
        { success: false, error: "Pilih minimal satu layanan (software atau hardware)." },
        { status: 400 }
      );
    }

    // On-site area validation — only Cimahi & Bandung
    if (d.serviceArea === "ON_SITE") {
      const city = d.customerCity.toLowerCase();
      const isAllowed = ["cimahi", "bandung"].some((c) => city.includes(c));
      if (!isAllowed) {
        return NextResponse.json(
          {
            success: false,
            error:
              "On-site service is currently available only in Cimahi & Bandung. Silakan pilih opsi Kirim Unit.",
          },
          { status: 400 }
        );
      }
    }

    const orderNumber = await generateOrderNumber();

    // Merge software + hardware service IDs into a single array
    const serviceTypeArr = [...d.softwareServices, ...d.hardwareServices];

    const order = await db.serviceOrder.create({
      data: {
        orderNumber,
        serviceArea: d.serviceArea,
        customerName: d.customerName,
        customerPhone: d.customerPhone,
        customerEmail: d.customerEmail || null,
        customerCity: d.customerCity,
        customerProvince: d.customerProvince,
        deviceBrand: d.deviceBrand,
        deviceModel: d.deviceModel,
        imei: d.imei || null,
        deviceCondition: d.deviceCondition,
        serviceType: JSON.stringify(serviceTypeArr),
        serviceDetails: d.serviceDetails || null,
        previousRepair: d.previousRepair || null,
        rootStatus: d.rootStatus || null,
        customRomStatus: d.customRomStatus || null,
        waterExposure: d.waterExposure || null,
        droppedStatus: d.droppedStatus || null,
        serviceAddress: d.serviceArea === "ON_SITE" ? d.serviceAddress || null : null,
        serviceLandmark: d.serviceArea === "ON_SITE" ? d.serviceLandmark || null : null,
        latitude: d.serviceArea === "ON_SITE" ? d.latitude ?? null : null,
        longitude: d.serviceArea === "ON_SITE" ? d.longitude ?? null : null,
        mapsUrl: d.serviceArea === "ON_SITE" ? d.mapsUrl || null : null,
        preferredDate: d.serviceArea === "ON_SITE" ? d.preferredDate || null : null,
        preferredTime: d.serviceArea === "ON_SITE" ? d.preferredTime || null : null,
        shippingNotes: d.serviceArea === "SEND_DEVICE" ? d.shippingNotes || null : null,
        paymentMethod: d.paymentMethod,
        paymentStatus:
          d.paymentMethod === "TRANSFER" ? PAYMENT_STATUS.WAITING_CONFIRMATION : PAYMENT_STATUS.UNPAID,
        orderStatus: ORDER_STATUS.NEW,
        privacyConsent: d.privacyConsent,
      },
    });

    // Initial status history entry
    await db.orderStatusHistory.create({
      data: {
        orderId: order.id,
        oldStatus: null,
        newStatus: ORDER_STATUS.NEW,
        note: "Order created by customer",
      },
    });

    const serialized = await serializeOrder(order);
    return NextResponse.json({ success: true, data: serialized }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/orders] error:", err);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan saat membuat order. Silakan coba lagi." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Admin-only
  const cookieHeader = req.headers.get("cookie") || "";
  const token = extractCookie(cookieHeader, SESSION_COOKIE_NAME);
  const session = verifySession(token);
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const payment = url.searchParams.get("payment");
  const search = url.searchParams.get("search");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "100"), 500);

  const where: Record<string, unknown> = {};
  if (status) where.orderStatus = status;
  if (payment) where.paymentStatus = payment;
  if (search) {
    where.OR = [
      { orderNumber: { contains: search } },
      { customerName: { contains: search } },
      { customerPhone: { contains: search } },
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

function extractCookie(header: string, name: string): string | undefined {
  const parts = header.split(";");
  for (const p of parts) {
    const [k, ...v] = p.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return undefined;
}
