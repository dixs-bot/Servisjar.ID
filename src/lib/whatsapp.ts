// JARVIS.ID — WhatsApp utilities
// All WhatsApp functionality uses official number 6285189976233 (085189976233)

import { BUSINESS } from "./constants";
import type { OrderRecord } from "./types";

/**
 * Open WhatsApp with a prefilled message to JARVIS.ID.
 * Uses wa.me link (works on both desktop & mobile).
 */
export function openWhatsApp(message?: string) {
  const text = encodeURIComponent(message ?? BUSINESS.defaultWaMessage);
  const url = `https://wa.me/${BUSINESS.whatsappInternational}?text=${text}`;
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
  return url;
}

/**
 * Build a professional WhatsApp message summarizing the order.
 * Includes media links (signed URLs in production; local URLs in sandbox demo).
 */
export function createWhatsAppMessage(order: OrderRecord): string {
  const lines: string[] = [];
  lines.push("*PERMINTAAN SERVICE JARVIS.ID*");
  lines.push("================================");
  lines.push(`*Order:* ${order.orderNumber}`);
  lines.push(`*Tipe Service:* ${order.serviceArea === "ON_SITE" ? "Service Panggilan" : "Kirim Unit"}`);
  lines.push("");
  lines.push("*DATA CUSTOMER*");
  lines.push(`Nama: ${order.customerName}`);
  lines.push(`WhatsApp: ${order.customerPhone}`);
  if (order.customerEmail) lines.push(`Email: ${order.customerEmail}`);
  lines.push(`Kota: ${order.customerCity}`);
  lines.push(`Provinsi: ${order.customerProvince}`);
  lines.push("");
  lines.push("*DATA DEVICE*");
  lines.push(`Brand: ${order.deviceBrand}`);
  lines.push(`Model: ${order.deviceModel}`);
  if (order.imei) lines.push(`IMEI: ${order.imei}`);
  lines.push(`Kondisi: ${order.deviceCondition}`);
  lines.push("");
  lines.push("*SERVICE*");
  lines.push(`Service: ${order.serviceType.join(", ") || "-"}`);
  if (order.serviceDetails) lines.push(`Detail: ${order.serviceDetails}`);
  lines.push("");
  lines.push("*RIWAYAT DEVICE*");
  if (order.previousRepair) lines.push(`Pernah dibuka: ${order.previousRepair}`);
  if (order.rootStatus) lines.push(`Pernah di-root: ${order.rootStatus}`);
  if (order.customRomStatus) lines.push(`Pernah custom ROM: ${order.customRomStatus}`);
  if (order.waterExposure) lines.push(`Terkena air: ${order.waterExposure}`);
  if (order.droppedStatus) lines.push(`Pernah jatuh: ${order.droppedStatus}`);
  lines.push("");
  if (order.serviceArea === "ON_SITE") {
    lines.push("*LOKASI SERVICE*");
    if (order.serviceAddress) lines.push(`Alamat: ${order.serviceAddress}`);
    if (order.serviceLandmark) lines.push(`Landmark: ${order.serviceLandmark}`);
    if (order.latitude && order.longitude) lines.push(`Koordinat: ${order.latitude}, ${order.longitude}`);
    if (order.mapsUrl) lines.push(`Maps: ${order.mapsUrl}`);
    if (order.preferredDate) lines.push(`Tanggal: ${order.preferredDate}`);
    if (order.preferredTime) lines.push(`Jam: ${order.preferredTime}`);
  } else {
    lines.push("*PENGIRIMAN UNIT*");
    if (order.shippingNotes) lines.push(`Catatan: ${order.shippingNotes}`);
    lines.push("Saya menunggu konfirmasi JARVIS.ID sebelum mengirim perangkat.");
  }
  lines.push("");
  lines.push("*PEMBAYARAN*");
  lines.push(`Metode: ${order.paymentMethod}`);
  lines.push(`Status: ${order.paymentStatus}`);
  lines.push("");
  // Media info
  const photos = order.media.filter((m) => m.fileType === "DAMAGE_PHOTO");
  const videos = order.media.filter((m) => m.fileType === "DAMAGE_VIDEO");
  const paymentProof = order.media.filter((m) => m.fileType === "PAYMENT_PROOF");
  lines.push("*MEDIA*");
  lines.push(`Foto: ${photos.length}`);
  lines.push(`Video: ${videos.length}`);
  if (paymentProof.length > 0) lines.push(`Bukti Bayar: ${paymentProof.length}`);
  if (photos.length > 0 || videos.length > 0 || paymentProof.length > 0) {
    lines.push("");
    lines.push("*Link Media:*");
    [...photos, ...videos, ...paymentProof].forEach((m) => {
      lines.push(`- [${m.fileType}] ${m.fileName}: ${m.fileUrl}`);
    });
  }
  lines.push("");
  lines.push("================================");
  if (order.serviceArea === "SEND_DEVICE") {
    lines.push("For customers outside Cimahi & Bandung, I understand that I must wait for JARVIS.ID confirmation before shipping the device.");
    lines.push("");
  }
  lines.push(`Terkirim dari ${BUSINESS.siteUrl}`);
  return lines.join("\n");
}

/**
 * Validate Indonesian phone number, normalize to international format (no +).
 * Accepts: 08..., +62..., 62..., 021..., etc.
 */
export function normalizeIndonesianPhone(input: string): string {
  const cleaned = input.replace(/[\s\-()+.]/g, "");
  if (/^0\d{8,13}$/.test(cleaned)) {
    return "62" + cleaned.substring(1);
  }
  if (/^62\d{8,13}$/.test(cleaned)) {
    return cleaned;
  }
  if (/^\+\d{8,15}$/.test(input.trim())) {
    return input.trim().substring(1).replace(/[\s\-()+.]/g, "");
  }
  return cleaned;
}

export function isValidIndonesianPhone(input: string): boolean {
  const normalized = normalizeIndonesianPhone(input);
  return /^62\d{8,13}$/.test(normalized);
}
