"use client";

import { User, Smartphone, Wrench, MapPin, Package, CreditCard, Banknote, FileText, Shield } from "lucide-react";
import { useOrderWizard } from "@/lib/order-wizard-store";
import { SOFTWARE_SERVICES, HARDWARE_SERVICES } from "@/lib/constants";

export function OrderSummary({ onEdit }: { onEdit: (step: number) => void }) {
  const { form } = useOrderWizard();

  const softwareLabels = form.softwareServices
    .map((id) => SOFTWARE_SERVICES.find((s) => s.id === id)?.label)
    .filter(Boolean);
  const hardwareLabels = form.hardwareServices
    .map((id) => HARDWARE_SERVICES.find((s) => s.id === id)?.label)
    .filter(Boolean);
  const allServices = [...softwareLabels, ...hardwareLabels] as string[];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Ringkasan Service</h2>
        <p className="text-sm text-slate-400">Periksa data sebelum mengirim permintaan service.</p>
      </div>

      {/* Customer */}
      <SummaryCard
        icon={User}
        title="Customer"
        step={1}
        onEdit={onEdit}
        rows={[
          { label: "Nama", value: form.customerName },
          { label: "WhatsApp", value: form.customerPhone },
          ...(form.customerEmail ? [{ label: "Email", value: form.customerEmail }] : []),
          { label: "Kota", value: form.customerCity },
          { label: "Provinsi", value: form.customerProvince },
        ]}
      />

      {/* Device */}
      <SummaryCard
        icon={Smartphone}
        title="Device"
        step={2}
        onEdit={onEdit}
        rows={[
          { label: "Brand", value: form.deviceBrand },
          { label: "Model", value: form.deviceModel },
          ...(form.imei ? [{ label: "IMEI", value: form.imei }] : []),
          { label: "Kondisi", value: form.deviceCondition },
        ]}
      />

      {/* Service */}
      <SummaryCard
        icon={Wrench}
        title="Service"
        step={3}
        onEdit={onEdit}
        rows={[
          { label: "Layanan", value: allServices.join(", ") || "-" },
          ...(form.serviceDetails ? [{ label: "Detail", value: form.serviceDetails }] : []),
          ...(form.previousRepair ? [{ label: "Pernah dibuka", value: form.previousRepair }] : []),
          ...(form.rootStatus ? [{ label: "Root status", value: form.rootStatus }] : []),
          ...(form.customRomStatus ? [{ label: "Custom ROM", value: form.customRomStatus }] : []),
          ...(form.waterExposure ? [{ label: "Terkena air", value: form.waterExposure }] : []),
          ...(form.droppedStatus ? [{ label: "Pernah jatuh", value: form.droppedStatus }] : []),
        ]}
      />

      {/* Media */}
      <SummaryCard
        icon={FileText}
        title="Media"
        step={5}
        onEdit={onEdit}
        rows={[
          { label: "Foto", value: `${form.photos.length} file` },
          { label: "Video", value: `${form.videos.length} file` },
        ]}
      />

      {/* Location / Shipping */}
      {form.serviceArea === "ON_SITE" ? (
        <SummaryCard
          icon={MapPin}
          title="Lokasi Service"
          step={6}
          onEdit={onEdit}
          rows={[
            { label: "Alamat", value: form.serviceAddress || "-" },
            ...(form.serviceLandmark ? [{ label: "Landmark", value: form.serviceLandmark }] : []),
            ...(form.latitude !== null && form.longitude !== null
              ? [{ label: "Koordinat", value: `${form.latitude.toFixed(6)}, ${form.longitude.toFixed(6)}` }]
              : []),
            ...(form.mapsUrl ? [{ label: "Maps", value: form.mapsUrl }] : []),
            ...(form.preferredDate ? [{ label: "Tanggal", value: form.preferredDate }] : []),
            ...(form.preferredTime ? [{ label: "Jam", value: form.preferredTime }] : []),
          ]}
        />
      ) : (
        <SummaryCard
          icon={Package}
          title="Pengiriman Unit"
          step={6}
          onEdit={onEdit}
          rows={[
            ...(form.shippingNotes ? [{ label: "Catatan", value: form.shippingNotes }] : []),
            { label: "Status", value: "Menunggu konfirmasi admin sebelum dikirim" },
          ]}
        />
      )}

      {/* Payment */}
      <SummaryCard
        icon={form.paymentMethod === "CASH" ? Banknote : CreditCard}
        title="Pembayaran"
        step={7}
        onEdit={onEdit}
        rows={[
          { label: "Metode", value: form.paymentMethod },
          ...(form.paymentMethod === "TRANSFER" && form.paymentProof.length > 0
            ? [{ label: "Bukti Bayar", value: `${form.paymentProof.length} file` }]
            : []),
        ]}
      />

      {/* Privacy consent */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-white mb-1">Privacy Consent</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              "Saya menyetujui data yang saya masukkan digunakan untuk keperluan konsultasi, konfirmasi,
              dan pelayanan service HP JARVIS.ID."
            </p>
            <label className="flex items-center gap-2 mt-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.privacyConsent}
                onChange={(e) => useOrderWizard.getState().patch({ privacyConsent: e.target.checked })}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="text-sm text-slate-200">Saya menyetujui kebijakan privasi</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  title,
  step,
  onEdit,
  rows,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  step: number;
  onEdit: (step: number) => void;
  rows: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>
        </div>
        <button
          type="button"
          onClick={() => onEdit(step)}
          className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
        >
          Edit
        </button>
      </div>
      <dl className="grid sm:grid-cols-2 gap-x-4 gap-y-2">
        {rows.map((r, i) => (
          <div key={i} className="flex flex-col sm:flex-row sm:justify-between text-sm">
            <dt className="text-slate-500 text-xs uppercase tracking-wider shrink-0">{r.label}</dt>
            <dd className="text-slate-200 sm:text-right break-words">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
