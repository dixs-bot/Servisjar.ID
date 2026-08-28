// JARVIS.ID — shared types

export type ServiceArea = "ON_SITE" | "SEND_DEVICE";
export type PaymentMethod = "CASH" | "TRANSFER";
export type OrderStatus =
  | "NEW"
  | "WAITING_CONFIRMATION"
  | "CONFIRMED"
  | "WAITING_SHIPMENT"
  | "RECEIVED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";
export type PaymentStatus = "UNPAID" | "WAITING_CONFIRMATION" | "PAID" | "CANCELLED";
export type MediaType = "DAMAGE_PHOTO" | "DAMAGE_VIDEO" | "PAYMENT_PROOF";

export interface UploadedFile {
  file: File;
  preview?: string;
  progress: number;
  error?: string;
  uploadedPath?: string;
  uploadedUrl?: string;
}

export interface OrderFormData {
  // service area
  serviceArea: ServiceArea;
  // customer
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerCity: string;
  customerProvince: string;
  // device
  deviceBrand: string;
  deviceModel: string;
  imei: string;
  deviceCondition: string;
  // service
  softwareServices: string[];
  hardwareServices: string[];
  serviceDetails: string;
  // damage history
  previousRepair: string;
  rootStatus: string;
  customRomStatus: string;
  waterExposure: string;
  droppedStatus: string;
  // media
  photos: UploadedFile[];
  videos: UploadedFile[];
  paymentProof: UploadedFile[];
  // location (on-site)
  serviceAddress: string;
  serviceLandmark: string;
  latitude: number | null;
  longitude: number | null;
  mapsUrl: string;
  preferredDate: string;
  preferredTime: string;
  // shipping (send-device)
  shippingNotes: string;
  // payment
  paymentMethod: PaymentMethod | "";
  // consent
  privacyConsent: boolean;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  serviceArea: ServiceArea;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  customerCity: string;
  customerProvince: string;
  deviceBrand: string;
  deviceModel: string;
  imei: string | null;
  deviceCondition: string;
  serviceType: string[];
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
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  privacyConsent: boolean;
  createdAt: string;
  updatedAt: string;
  media: OrderMediaRecord[];
  statusHistory: OrderStatusHistoryRecord[];
  notes: ServiceNoteRecord[];
}

export interface OrderMediaRecord {
  id: string;
  orderId: string;
  fileType: MediaType;
  fileName: string;
  filePath: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  createdAt: string;
}

export interface OrderStatusHistoryRecord {
  id: string;
  orderId: string;
  oldStatus: string | null;
  newStatus: string;
  note: string | null;
  createdAt: string;
}

export interface ServiceNoteRecord {
  id: string;
  orderId: string;
  note: string;
  noteType: string;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
