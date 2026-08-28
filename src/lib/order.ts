// JARVIS.ID — order number generator + helpers

import { db } from "@/lib/db";
import { randomBytes } from "crypto";

/**
 * Generate unique order number: JARVIS-YYYYMMDD-XXXXXX (6 hex chars)
 */
export async function generateOrderNumber(): Promise<string> {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const datePart = `${y}${m}${d}`;

  // Try up to 5 times in case of unlikely collision
  for (let attempt = 0; attempt < 5; attempt++) {
    const suffix = randomBytes(3).toString("hex").toUpperCase(); // 6 hex chars
    const candidate = `JARVIS-${datePart}-${suffix}`;
    const existing = await db.serviceOrder.findUnique({
      where: { orderNumber: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
  }
  // Fallback with longer suffix
  const suffix = randomBytes(4).toString("hex").toUpperCase();
  return `JARVIS-${datePart}-${suffix}`;
}

/**
 * Map Prisma record to API-friendly OrderRecord (with parsed JSON fields, media, history, notes).
 */
export async function serializeOrder(order: {
  id: string;
  orderNumber: string;
  serviceArea: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  customerCity: string;
  customerProvince: string;
  deviceBrand: string;
  deviceModel: string;
  imei: string | null;
  deviceCondition: string;
  serviceType: string;
  serviceDetails: string | null;
  previousRepair: string | null;
  rootStatus: string | null;
  customRomStatus: string | null;
  waterExposure: string | null;
  droppedStatus: string | null;
  serviceAddress: string | null;
  serviceLandmark: string | null;
  latitude: number | null;
  longitude: number | null;
  mapsUrl: string | null;
  preferredDate: string | null;
  preferredTime: string | null;
  shippingNotes: string | null;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  privacyConsent: boolean;
  createdAt: Date;
  updatedAt: Date;
  media?: Array<{
    id: string;
    orderId: string;
    fileType: string;
    fileName: string;
    filePath: string;
    fileUrl: string;
    mimeType: string;
    fileSize: number;
    createdAt: Date;
  }>;
  statusHistory?: Array<{
    id: string;
    orderId: string;
    oldStatus: string | null;
    newStatus: string;
    note: string | null;
    createdAt: Date;
  }>;
  notes?: Array<{
    id: string;
    orderId: string;
    note: string;
    noteType: string;
    createdAt: Date;
  }>;
}) {
  let serviceType: string[] = [];
  try {
    serviceType = JSON.parse(order.serviceType);
    if (!Array.isArray(serviceType)) serviceType = [];
  } catch {
    serviceType = order.serviceType ? [order.serviceType] : [];
  }

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    serviceArea: order.serviceArea as "ON_SITE" | "SEND_DEVICE",
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    customerEmail: order.customerEmail,
    customerCity: order.customerCity,
    customerProvince: order.customerProvince,
    deviceBrand: order.deviceBrand,
    deviceModel: order.deviceModel,
    imei: order.imei,
    deviceCondition: order.deviceCondition,
    serviceType,
    serviceDetails: order.serviceDetails,
    previousRepair: order.previousRepair,
    rootStatus: order.rootStatus,
    customRomStatus: order.customRomStatus,
    waterExposure: order.waterExposure,
    droppedStatus: order.droppedStatus,
    serviceAddress: order.serviceAddress,
    serviceLandmark: order.serviceLandmark,
    latitude: order.latitude,
    longitude: order.longitude,
    mapsUrl: order.mapsUrl,
    preferredDate: order.preferredDate,
    preferredTime: order.preferredTime,
    shippingNotes: order.shippingNotes,
    paymentMethod: order.paymentMethod as "CASH" | "TRANSFER",
    paymentStatus: order.paymentStatus as "UNPAID" | "WAITING_CONFIRMATION" | "PAID" | "CANCELLED",
    orderStatus: order.orderStatus as
      | "NEW"
      | "WAITING_CONFIRMATION"
      | "CONFIRMED"
      | "WAITING_SHIPMENT"
      | "RECEIVED"
      | "IN_PROGRESS"
      | "COMPLETED"
      | "CANCELLED",
    privacyConsent: order.privacyConsent,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    media: (order.media ?? []).map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
    })),
    statusHistory: (order.statusHistory ?? []).map((h) => ({
      ...h,
      createdAt: h.createdAt.toISOString(),
    })),
    notes: (order.notes ?? []).map((n) => ({
      ...n,
      createdAt: n.createdAt.toISOString(),
    })),
  };
}
