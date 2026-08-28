"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Send, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNav } from "@/lib/nav-store";
import { useOrderWizard } from "@/lib/order-wizard-store";
import { StepProgress } from "./StepProgress";
import { CustomerStep } from "./CustomerStep";
import { DeviceStep } from "./DeviceStep";
import { ServiceStep } from "./ServiceStep";
import { DamageStep } from "./DamageStep";
import { MediaStep } from "./MediaStep";
import { LocationStep } from "./LocationStep";
import { ShippingStep } from "./ShippingStep";
import { PaymentStep } from "./PaymentStep";
import { OrderSummary } from "./OrderSummary";
import { isValidIndonesianPhone } from "@/lib/whatsapp";
import { toast } from "sonner";
import type { ApiResponse, OrderRecord } from "@/lib/types";

export function OrderWizard() {
  const { navigate, initialServiceArea } = useNav();
  const { step, form, patch, next, back, setStep, submitting, setSubmitting, reset, setLastSubmitted } = useOrderWizard();
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Initialize service area from nav
  useEffect(() => {
    if (initialServiceArea && form.serviceArea !== initialServiceArea) {
      patch({ serviceArea: initialServiceArea });
    }
     
  }, [initialServiceArea]);

  // Step-specific validation
  const stepErrors: Record<number, string[]> = {};

  // Step 1: Customer
  const s1: string[] = [];
  if (!form.customerName.trim()) s1.push("Nama lengkap wajib diisi");
  if (!form.customerPhone.trim() || !isValidIndonesianPhone(form.customerPhone)) s1.push("Nomor WhatsApp tidak valid");
  if (!form.customerCity.trim()) s1.push("Kota wajib diisi");
  if (!form.customerProvince.trim()) s1.push("Provinsi wajib diisi");
  if (form.serviceArea === "ON_SITE") {
    const cityOk = ["cimahi", "bandung"].some((c) => form.customerCity.toLowerCase().includes(c));
    if (!cityOk) s1.push("On-site hanya tersedia di Cimahi & Bandung");
  }
  if (s1.length) stepErrors[1] = s1;

  // Step 2: Device
  const s2: string[] = [];
  if (!form.deviceBrand) s2.push("Brand wajib dipilih");
  if (!form.deviceModel.trim()) s2.push("Model wajib diisi");
  if (!form.deviceCondition) s2.push("Kondisi device wajib dipilih");
  if (s2.length) stepErrors[2] = s2;

  // Step 3: Service
  const s3: string[] = [];
  if (form.softwareServices.length === 0 && form.hardwareServices.length === 0)
    s3.push("Pilih minimal satu service");
  if (s3.length) stepErrors[3] = s3;

  // Step 4: Damage
  const s4: string[] = [];
  if (!form.serviceDetails.trim()) s4.push("Detail kerusakan wajib diisi");
  if (!form.previousRepair) s4.push("Pilih status pernah dibuka");
  if (!form.rootStatus) s4.push("Pilih status root");
  if (!form.customRomStatus) s4.push("Pilih status custom ROM");
  if (!form.waterExposure) s4.push("Pilih status terkena air");
  if (!form.droppedStatus) s4.push("Pilih status pernah jatuh");
  if (s4.length) stepErrors[4] = s4;

  // Step 6: Location (on-site) — address required
  if (form.serviceArea === "ON_SITE") {
    const s6: string[] = [];
    if (!form.serviceAddress.trim()) s6.push("Alamat lengkap wajib diisi");
    if (s6.length) stepErrors[6] = s6;
  }

  // Step 7: Payment
  const s7: string[] = [];
  if (!form.paymentMethod) s7.push("Pilih metode pembayaran");
  if (s7.length) stepErrors[7] = s7;

  // Step 8: Summary — privacy consent required
  const s8: string[] = [];
  if (!form.privacyConsent) s8.push("Anda harus menyetujui kebijakan privasi");
  if (s8.length) stepErrors[8] = s8;

  const canNext = !stepErrors[step];

  const handleNext = () => {
    if (stepErrors[step]) {
      toast.error(stepErrors[step][0]);
      return;
    }
    next();
  };

  const handleSubmit = async () => {
    if (stepErrors[8]) {
      toast.error(stepErrors[8][0]);
      return;
    }
    if (submitting) return; // prevent double-submit

    setSubmitting(true);
    setSubmitError(null);

    try {
      // 1) Create order
      const payload = {
        serviceArea: form.serviceArea,
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerEmail: form.customerEmail,
        customerCity: form.customerCity,
        customerProvince: form.customerProvince,
        deviceBrand: form.deviceBrand,
        deviceModel: form.deviceModel,
        imei: form.imei,
        deviceCondition: form.deviceCondition,
        softwareServices: form.softwareServices,
        hardwareServices: form.hardwareServices,
        serviceDetails: form.serviceDetails,
        previousRepair: form.previousRepair,
        rootStatus: form.rootStatus,
        customRomStatus: form.customRomStatus,
        waterExposure: form.waterExposure,
        droppedStatus: form.droppedStatus,
        serviceAddress: form.serviceAddress,
        serviceLandmark: form.serviceLandmark,
        latitude: form.latitude,
        longitude: form.longitude,
        mapsUrl: form.mapsUrl,
        preferredDate: form.preferredDate,
        preferredTime: form.preferredTime,
        shippingNotes: form.shippingNotes,
        paymentMethod: form.paymentMethod,
        privacyConsent: form.privacyConsent,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json: ApiResponse<OrderRecord> = await res.json();
      if (!json.success || !json.data) {
        throw new Error(json.error || "Gagal membuat order");
      }
      const order = json.data;

      // 2) Upload media files (photos + videos + payment proof)
      const uploadFiles = async (
        files: typeof form.photos,
        kind: "PHOTOS" | "VIDEOS" | "PAYMENT"
      ) => {
        if (files.length === 0) return;
        const fd = new FormData();
        fd.append("orderId", order.id);
        fd.append("kind", kind);
        files.forEach((f) => fd.append("files", f.file));
        const upRes = await fetch("/api/upload", { method: "POST", body: fd });
        const upJson = await upRes.json();
        if (!upJson.success) {
          throw new Error(upJson.error || `Gagal upload ${kind}`);
        }
      };

      await uploadFiles(form.photos, "PHOTOS");
      await uploadFiles(form.videos, "VIDEOS");
      if (form.paymentMethod === "TRANSFER" && form.paymentProof.length > 0) {
        await uploadFiles(form.paymentProof, "PAYMENT");
      }

      // 3) Revoke object URLs
      [...form.photos, ...form.videos, ...form.paymentProof].forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });

      setLastSubmitted(order.orderNumber);
      navigate({ name: "order", orderNumber: order.orderNumber });
      // Don't reset yet — success page may want to show summary
    } catch (err) {
      console.error("[submit order] error:", err);
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan. Silakan coba lagi.";
      setSubmitError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <CustomerStep />;
      case 2: return <DeviceStep />;
      case 3: return <ServiceStep />;
      case 4: return <DamageStep />;
      case 5: return <MediaStep />;
      case 6: return form.serviceArea === "ON_SITE" ? <LocationStep /> : <ShippingStep />;
      case 7: return <PaymentStep />;
      case 8: return <OrderSummary onEdit={(s) => setStep(s)} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050a17]">
      <WizardHeader />

      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <div className="mb-6">
            <StepProgress />
          </div>

          <div className="rounded-3xl bg-[#0a1428]/80 backdrop-blur border border-cyan-500/20 p-5 sm:p-8">
            {renderStep()}

            {submitError && (
              <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <p className="text-xs text-red-200">{submitError}</p>
              </div>
            )}

            {/* Nav buttons */}
            <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-800">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  if (step === 1) {
                    navigate({ name: "home" });
                  } else {
                    back();
                  }
                }}
                disabled={submitting}
                className="text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {step === 1 ? "Batal" : "Kembali"}
              </Button>

              {step < 8 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={submitting}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold"
                >
                  Lanjut
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || !form.privacyConsent}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      MENGIRIM DATA...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      KIRIM PERMINTAAN SERVICE
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>

      <FooterLite />
    </div>
  );
}

function WizardHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#050a17]/95 backdrop-blur-md border-b border-cyan-500/20">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl h-16 lg:h-20 flex items-center justify-between">
        <button
          onClick={() => useNav.getState().navigate({ name: "home" })}
          className="flex items-center gap-2"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center jarvis-glow">
            <svg className="w-5 h-5 text-[#050a17]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <rect x="9" y="9" width="6" height="6" />
              <line x1="9" y1="2" x2="9" y2="4" />
              <line x1="15" y1="2" x2="15" y2="4" />
              <line x1="9" y1="20" x2="9" y2="22" />
              <line x1="15" y1="20" x2="15" y2="22" />
              <line x1="20" y1="9" x2="22" y2="9" />
              <line x1="20" y1="14" x2="22" y2="14" />
              <line x1="2" y1="9" x2="4" y2="9" />
              <line x1="2" y1="14" x2="4" y2="14" />
            </svg>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-base font-bold text-white tracking-wider">
              JARVIS<span className="text-cyan-400">.ID</span>
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-cyan-300/70">Order Service</span>
          </div>
        </button>
      </div>
    </header>
  );
}

function FooterLite() {
  return (
    <footer className="bg-[#050a17] border-t border-cyan-500/10 py-4">
      <div className="container mx-auto px-4 max-w-7xl text-center">
        <p className="text-xs text-slate-500">© {new Date().getFullYear()} JARVIS.ID • Service HP Panggilan & Oprek Android</p>
      </div>
    </footer>
  );
}
