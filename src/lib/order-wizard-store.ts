"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OrderFormData, ServiceArea, UploadedFile } from "@/lib/types";

const initialForm: OrderFormData = {
  serviceArea: "ON_SITE",
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  customerCity: "",
  customerProvince: "",
  deviceBrand: "",
  deviceModel: "",
  imei: "",
  deviceCondition: "",
  softwareServices: [],
  hardwareServices: [],
  serviceDetails: "",
  previousRepair: "",
  rootStatus: "",
  customRomStatus: "",
  waterExposure: "",
  droppedStatus: "",
  photos: [],
  videos: [],
  paymentProof: [],
  serviceAddress: "",
  serviceLandmark: "",
  latitude: null,
  longitude: null,
  mapsUrl: "",
  preferredDate: "",
  preferredTime: "",
  shippingNotes: "",
  paymentMethod: "",
  privacyConsent: false,
};

interface OrderWizardState {
  step: number;
  form: OrderFormData;
  submitting: boolean;
  lastSubmittedOrderNumber: string | null;
  // actions
  setStep: (step: number) => void;
  next: () => void;
  back: () => void;
  patch: (partial: Partial<OrderFormData>) => void;
  setServiceArea: (a: ServiceArea) => void;
  reset: () => void;
  setSubmitting: (v: boolean) => void;
  setLastSubmitted: (n: string | null) => void;
}

export const useOrderWizard = create<OrderWizardState>()(
  persist(
    (set, get) => ({
      step: 1,
      form: initialForm,
      submitting: false,
      lastSubmittedOrderNumber: null,
      setStep: (step) => set({ step }),
      next: () => set({ step: Math.min(get().step + 1, 8) }),
      back: () => set({ step: Math.max(get().step - 1, 1) }),
      patch: (partial) => set({ form: { ...get().form, ...partial } }),
      setServiceArea: (a) => set({ form: { ...get().form, serviceArea: a } }),
      reset: () => set({ step: 1, form: initialForm, submitting: false, lastSubmittedOrderNumber: null }),
      setSubmitting: (v) => set({ submitting: v }),
      setLastSubmitted: (n) => set({ lastSubmittedOrderNumber: n }),
    }),
    { name: "jarvis-order-wizard" }
  )
);

// Helper: turn a File into UploadedFile
export function makeUploadedFile(file: File): UploadedFile {
  const isImage = file.type.startsWith("image/");
  return {
    file,
    preview: isImage ? URL.createObjectURL(file) : undefined,
    progress: 0,
  };
}
