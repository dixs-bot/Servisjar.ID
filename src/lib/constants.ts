// JARVIS.ID business constants — DO NOT invent values; only what the brief provides.

export const BUSINESS = {
  brandName: "JARVIS.ID",
  tagline: "OPREK • CUSTOM ROM • SERVICE HP",
  taglineEn: "ANDROID MODDING • CUSTOM ROM • PHONE SERVICE",
  subTagline: "SERVICE PANGGILAN • CIMAHI & BANDUNG",
  // WhatsApp — official number from brief
  whatsappDisplay: "085189976233",
  whatsappInternational: "6285189976233",
  // Counter address — official, from brief
  counter: {
    name: "JARVIS.ID",
    building: "Wisma Agung",
    street: "Jl. KH. Utsman Dhomiri No. D14",
    rtRw: "RT 02 / RW 17",
    village: "Kel. Padasuka",
    district: "Kec. Cimahi Tengah",
    city: "Cimahi",
    fullText:
      "JARVIS.ID\nWisma Agung\nJl. KH. Utsman Dhomiri No. D14\nRT 02 / RW 17\nKel. Padasuka\nKec. Cimahi Tengah\nCimahi",
  },
  // On-site service area — only these cities
  onSiteCities: ["Cimahi", "Bandung"],
  // Default WhatsApp consultation message
  defaultWaMessage: "Hallo JARVIS.ID, saya ingin konsultasi service HP.",
  // Bank config — empty by default; admin provides via env
  bank: {
    name: process.env.BANK_NAME || "",
    accountName: process.env.ACCOUNT_NAME || "",
    accountNumber: process.env.ACCOUNT_NUMBER || "",
  },
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
} as const;

// =====================
// DEVICE BRANDS
// =====================
export const DEVICE_BRANDS = [
  "Samsung",
  "Xiaomi",
  "Redmi",
  "POCO",
  "OPPO",
  "Vivo",
  "Realme",
  "Infinix",
  "Tecno",
  "Huawei",
  "Asus",
  "OnePlus",
  "iPhone",
  "Other",
] as const;

// =====================
// DEVICE CONDITIONS
// =====================
export const DEVICE_CONDITIONS = [
  "Normal",
  "Bootloop",
  "Stuck Logo",
  "Completely Dead",
  "Broken Screen",
  "Cannot Charge",
  "Random Restart",
  "Freezing",
  "Other",
] as const;

// =====================
// SOFTWARE SERVICES
// =====================
export const SOFTWARE_SERVICES = [
  { id: "oprek", label: "Oprek HP" },
  { id: "custom_rom", label: "Custom ROM" },
  { id: "root", label: "Root" },
  { id: "non_root", label: "Non-Root" },
  { id: "tanam_smali", label: "Pasang / Tanam Smali" },
  { id: "flash_rom", label: "Flash ROM" },
  { id: "bootloop", label: "Bootloop" },
  { id: "restart", label: "Restart" },
  { id: "stuck_logo", label: "Stuck Logo" },
  { id: "optimization", label: "Android Optimization" },
  { id: "debloat", label: "Debloat" },
  { id: "android_mod", label: "Android Modification" },
] as const;

// =====================
// HARDWARE SERVICES
// =====================
export const HARDWARE_SERVICES = [
  { id: "lcd", label: "LCD" },
  { id: "touchscreen", label: "Touchscreen" },
  { id: "battery", label: "Battery Replacement" },
  { id: "double_battery", label: "Custom Double Battery" },
  { id: "heatsink", label: "Phone Heatsink Installation" },
  { id: "charging_connector", label: "Charging Connector" },
  { id: "buttons", label: "Buttons" },
  { id: "other_hardware", label: "Other Hardware Services" },
] as const;

// =====================
// YES/NO/UNKNOWN questions
// =====================
export const YES_NO_UNKNOWN = ["Yes", "No", "Unknown"] as const;

export const PREVIOUS_REPAIR_OPTIONS = [
  "Never",
  "Repaired by another shop",
  "Opened personally",
  "Unknown",
] as const;

// =====================
// SERVICE AREA TYPES
// =====================
export const SERVICE_AREA = {
  ON_SITE: "ON_SITE",
  SEND_DEVICE: "SEND_DEVICE",
} as const;

export type ServiceArea = (typeof SERVICE_AREA)[keyof typeof SERVICE_AREA];

// =====================
// PAYMENT
// =====================
export const PAYMENT_METHODS = ["CASH", "TRANSFER"] as const;

export const PAYMENT_STATUS = {
  UNPAID: "UNPAID",
  WAITING_CONFIRMATION: "WAITING_CONFIRMATION",
  PAID: "PAID",
  CANCELLED: "CANCELLED",
} as const;

export const ORDER_STATUS = {
  NEW: "NEW",
  WAITING_CONFIRMATION: "WAITING_CONFIRMATION",
  CONFIRMED: "CONFIRMED",
  WAITING_SHIPMENT: "WAITING_SHIPMENT",
  RECEIVED: "RECEIVED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

// =====================
// STATUS LABELS (Indonesian)
// =====================
export const ORDER_STATUS_LABELS: Record<string, string> = {
  NEW: "Order Baru",
  WAITING_CONFIRMATION: "Menunggu Konfirmasi",
  CONFIRMED: "Dikonfirmasi",
  WAITING_SHIPMENT: "Menunggu Pengiriman",
  RECEIVED: "Unit Diterima",
  IN_PROGRESS: "Sedang Dikerjakan",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  UNPAID: "Belum Bayar",
  WAITING_CONFIRMATION: "Menunggu Verifikasi",
  PAID: "Lunas",
  CANCELLED: "Dibatalkan",
};

// =====================
// MEDIA TYPES
// =====================
export const MEDIA_TYPES = {
  DAMAGE_PHOTO: "DAMAGE_PHOTO",
  DAMAGE_VIDEO: "DAMAGE_VIDEO",
  PAYMENT_PROOF: "PAYMENT_PROOF",
} as const;

// =====================
// FILE VALIDATION
// =====================
export const FILE_LIMITS = {
  PHOTOS: { maxCount: 5, maxBytes: 10 * 1024 * 1024, mime: ["image/jpeg", "image/png", "image/webp"], ext: ["jpg", "jpeg", "png", "webp"] },
  VIDEOS: { maxCount: 2, maxBytes: 50 * 1024 * 1024, mime: ["video/mp4", "video/quicktime", "video/webm"], ext: ["mp4", "mov", "webm"] },
  PAYMENT: { maxCount: 1, maxBytes: 10 * 1024 * 1024, mime: ["image/jpeg", "image/png", "image/webp", "application/pdf"], ext: ["jpg", "jpeg", "png", "webp", "pdf"] },
} as const;

// =====================
// ORDER WIZARD STEPS
// =====================
export const ON_SITE_STEPS = [
  { id: 1, key: "customer", label: "Customer" },
  { id: 2, key: "device", label: "Device" },
  { id: 3, key: "service", label: "Service" },
  { id: 4, key: "damage", label: "Damage" },
  { id: 5, key: "media", label: "Photo/Video" },
  { id: 6, key: "location", label: "Location" },
  { id: 7, key: "payment", label: "Payment" },
  { id: 8, key: "summary", label: "Confirmation" },
] as const;

export const SEND_DEVICE_STEPS = [
  { id: 1, key: "customer", label: "Customer" },
  { id: 2, key: "device", label: "Device" },
  { id: 3, key: "service", label: "Service" },
  { id: 4, key: "damage", label: "Damage" },
  { id: 5, key: "media", label: "Photo/Video" },
  { id: 6, key: "shipping", label: "Shipping" },
  { id: 7, key: "payment", label: "Payment" },
  { id: 8, key: "summary", label: "Confirmation" },
] as const;
