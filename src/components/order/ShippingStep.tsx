"use client";

import { Package, AlertTriangle, MapPin, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useOrderWizard } from "@/lib/order-wizard-store";
import { BUSINESS } from "@/lib/constants";

export function ShippingStep() {
  const { form, patch } = useOrderWizard();
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(BUSINESS.counter.fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Kirim Unit ke Counter</h2>
        <p className="text-sm text-slate-400">Untuk customer di luar Cimahi & Bandung.</p>
      </div>

      <div className="flex items-start gap-2 p-4 rounded-xl bg-amber-500/10 border border-amber-500/40">
        <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
        <div className="text-sm text-amber-100 leading-relaxed">
          <p className="font-bold mb-1">PENTING</p>
          <p>
            Untuk customer di luar Cimahi &amp; Bandung, silakan isi form terlebih dahulu. Tim
            JARVIS.ID akan melakukan pengecekan kebutuhan service.{" "}
            <span className="font-semibold">Jangan mengirim unit sebelum mendapatkan konfirmasi.</span>
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="shippingNotes" className="text-cyan-300 text-xs font-medium">
          Catatan Pengiriman <span className="text-slate-500">(opsional)</span>
        </Label>
        <Textarea
          id="shippingNotes"
          value={form.shippingNotes}
          onChange={(e) => patch({ shippingNotes: e.target.value })}
          placeholder="Contoh: ekspedisi yang dipakai, estimasi tanggal kirim, packaging khusus, dll."
          className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 min-h-[100px]"
          maxLength={2000}
        />
      </div>

      {/* Counter address */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-cyan-500/20">
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Alamat Counter JARVIS.ID
          </h3>
        </div>
        <div className="text-sm text-slate-300 space-y-0.5 mb-4">
          <p className="text-white font-semibold">{BUSINESS.counter.name}</p>
          <p>{BUSINESS.counter.building}</p>
          <p>{BUSINESS.counter.street}</p>
          <p>{BUSINESS.counter.rtRw}</p>
          <p>{BUSINESS.counter.village}</p>
          <p>{BUSINESS.counter.district}</p>
          <p>{BUSINESS.counter.city}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={copyAddress}
            className="bg-transparent border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 hover:text-cyan-200"
          >
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? "TERSALIN" : "SALIN ALAMAT"}
          </Button>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              BUSINESS.counter.fullText.replace(/\n/g, ", ")
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 h-10 rounded-md bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white text-sm font-medium"
          >
            <MapPin className="w-4 h-4 mr-2" />
            LIHAT LOKASI
          </a>
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
        <Package className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
        <p className="text-xs text-cyan-200/80 leading-relaxed">
          Setelah admin mengkonfirmasi, Anda akan menerima instruksi pengiriman lengkap via WhatsApp.
        </p>
      </div>
    </div>
  );
}
