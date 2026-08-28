"use client";

import { User, Phone, Mail, Building2, Map as MapIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrderWizard } from "@/lib/order-wizard-store";
import { isValidIndonesianPhone } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function CustomerStep() {
  const { form, patch } = useOrderWizard();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Data Customer</h2>
        <p className="text-sm text-slate-400">Masukkan informasi kontak Anda.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="customerName" className="text-cyan-300 text-xs font-medium">
            Nama Lengkap <span className="text-red-400">*</span>
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              id="customerName"
              value={form.customerName}
              onChange={(e) => patch({ customerName: e.target.value })}
              placeholder="Nama lengkap Anda"
              className="pl-10 bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 h-12"
              maxLength={120}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerPhone" className="text-cyan-300 text-xs font-medium">
            Nomor WhatsApp <span className="text-red-400">*</span>
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              id="customerPhone"
              value={form.customerPhone}
              onChange={(e) => patch({ customerPhone: e.target.value })}
              placeholder="08xxxxxxxxxx"
              className={cn(
                "pl-10 bg-slate-900/60 text-white placeholder:text-slate-500 focus:border-cyan-500 h-12",
                form.customerPhone && !isValidIndonesianPhone(form.customerPhone)
                  ? "border-red-500"
                  : "border-slate-700"
              )}
              inputMode="tel"
              maxLength={20}
            />
          </div>
          {form.customerPhone && !isValidIndonesianPhone(form.customerPhone) && (
            <p className="text-xs text-red-400">Format nomor WhatsApp Indonesia tidak valid.</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerEmail" className="text-cyan-300 text-xs font-medium">
            Email <span className="text-slate-500">(opsional)</span>
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              id="customerEmail"
              type="email"
              value={form.customerEmail}
              onChange={(e) => patch({ customerEmail: e.target.value })}
              placeholder="email@contoh.com"
              className="pl-10 bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 h-12"
              maxLength={120}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerCity" className="text-cyan-300 text-xs font-medium">
            Kota / Kabupaten <span className="text-red-400">*</span>
          </Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              id="customerCity"
              value={form.customerCity}
              onChange={(e) => patch({ customerCity: e.target.value })}
              placeholder="Contoh: Cimahi / Bandung / Jakarta"
              className="pl-10 bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 h-12"
              maxLength={120}
            />
          </div>
          {form.serviceArea === "ON_SITE" && form.customerCity && (
            <p className={cn(
              "text-xs",
              ["cimahi", "bandung"].some((c) => form.customerCity.toLowerCase().includes(c))
                ? "text-green-400"
                : "text-amber-400"
            )}>
              {["cimahi", "bandung"].some((c) => form.customerCity.toLowerCase().includes(c))
                ? "✓ Area on-site tersedia."
                : "⚠ On-site hanya tersedia di Cimahi & Bandung. Silakan pilih Kirim Unit."}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerProvince" className="text-cyan-300 text-xs font-medium">
            Provinsi <span className="text-red-400">*</span>
          </Label>
          <div className="relative">
            <MapIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              id="customerProvince"
              value={form.customerProvince}
              onChange={(e) => patch({ customerProvince: e.target.value })}
              placeholder="Contoh: Jawa Barat"
              className="pl-10 bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 h-12"
              maxLength={120}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
