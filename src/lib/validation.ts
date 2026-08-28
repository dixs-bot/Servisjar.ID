// JARVIS.ID — Zod validation schemas (server-side authoritative)

import { z } from "zod";
import { FILE_LIMITS } from "./constants";

export const yesNoUnknown = z.enum(["Yes", "No", "Unknown"]);
export const previousRepairSchema = z.enum([
  "Never",
  "Repaired by another shop",
  "Opened personally",
  "Unknown",
]);

export const serviceAreaSchema = z.enum(["ON_SITE", "SEND_DEVICE"]);
export const paymentMethodSchema = z.enum(["CASH", "TRANSFER"]);

// Indonesian phone validation
const phoneRegex = /^(\+62|62|0)8\d{7,12}$/;
const phoneNormalize = (v: string) => v.replace(/[\s\-()+.]/g, "");

export const orderSchema = z.object({
  serviceArea: serviceAreaSchema,
  // Customer
  customerName: z.string().min(2, "Nama lengkap wajib diisi").max(120),
  customerPhone: z
    .string()
    .min(8, "Nomor WhatsApp wajib diisi")
    .refine((v) => phoneRegex.test(phoneNormalize(v)), "Format nomor WhatsApp Indonesia tidak valid"),
  customerEmail: z.string().email("Email tidak valid").optional().or(z.literal("")),
  customerCity: z.string().min(2, "Kota wajib diisi").max(120),
  customerProvince: z.string().min(2, "Provinsi wajib diisi").max(120),
  // Device
  deviceBrand: z.string().min(1, "Brand wajib dipilih"),
  deviceModel: z.string().min(1, "Model wajib diisi").max(120),
  imei: z.string().max(40).optional().or(z.literal("")),
  deviceCondition: z.string().min(1, "Kondisi device wajib dipilih"),
  // Service
  softwareServices: z.array(z.string()).default([]),
  hardwareServices: z.array(z.string()).default([]),
  serviceDetails: z.string().max(2000).optional().or(z.literal("")),
  // Damage history
  previousRepair: previousRepairSchema.optional(),
  rootStatus: yesNoUnknown.optional(),
  customRomStatus: yesNoUnknown.optional(),
  waterExposure: yesNoUnknown.optional(),
  droppedStatus: yesNoUnknown.optional(),
  // Location (on-site)
  serviceAddress: z.string().max(500).optional().or(z.literal("")),
  serviceLandmark: z.string().max(200).optional().or(z.literal("")),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  mapsUrl: z.string().url().max(1000).optional().or(z.literal("")),
  preferredDate: z.string().max(20).optional().or(z.literal("")),
  preferredTime: z.string().max(40).optional().or(z.literal("")),
  // Shipping (send-device)
  shippingNotes: z.string().max(2000).optional().or(z.literal("")),
  // Payment
  paymentMethod: paymentMethodSchema,
  // Consent
  privacyConsent: z
    .boolean()
    .refine((v) => v === true, "Anda harus menyetujui kebijakan privasi"),
});

export type OrderInput = z.infer<typeof orderSchema>;

export const mediaSchema = z.object({
  fileType: z.enum(["DAMAGE_PHOTO", "DAMAGE_VIDEO", "PAYMENT_PROOF"]),
  fileName: z.string().min(1).max(255),
  filePath: z.string().min(1).max(500),
  fileUrl: z.string().min(1).max(1000),
  mimeType: z.string().min(1).max(100),
  fileSize: z.number().int().positive(),
});

export const statusUpdateSchema = z.object({
  orderStatus: z.enum([
    "NEW",
    "WAITING_CONFIRMATION",
    "CONFIRMED",
    "WAITING_SHIPMENT",
    "RECEIVED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
  ]),
  paymentStatus: z
    .enum(["UNPAID", "WAITING_CONFIRMATION", "PAID", "CANCELLED"])
    .optional(),
  note: z.string().max(1000).optional().or(z.literal("")),
});

export const noteSchema = z.object({
  note: z.string().min(1, "Catatan tidak boleh kosong").max(2000),
  noteType: z
    .enum(["GENERAL", "TECHNICIAN", "INSPECTION", "ESTIMATE", "PAYMENT", "CUSTOMER"])
    .default("GENERAL"),
});

export const adminLoginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

// File upload validation
export function validateFile(
  file: File,
  kind: "PHOTOS" | "VIDEOS" | "PAYMENT"
): { ok: boolean; error?: string } {
  const limit = FILE_LIMITS[kind];
  if (!limit.mime.includes(file.type)) {
    return { ok: false, error: `Tipe file tidak didukung. Allowed: ${limit.ext.join(", ")}` };
  }
  if (file.size > limit.maxBytes) {
    const mb = Math.round((limit.maxBytes / 1024 / 1024) * 10) / 10;
    return { ok: false, error: `Ukuran file melebihi ${mb} MB` };
  }
  return { ok: true };
}
