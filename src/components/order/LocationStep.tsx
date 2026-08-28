"use client";

import { useState } from "react";
import { MapPin, Navigation, ExternalLink, Calendar, Clock, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useOrderWizard } from "@/lib/order-wizard-store";
import { BUSINESS } from "@/lib/constants";

export function LocationStep() {
  const { form, patch } = useOrderWizard();
  const [locating, setLococating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const useMyLocation = () => {
    setGeoError(null);
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoError("Browser tidak mendukung GPS. Silakan isi alamat manual.");
      return;
    }
    setLococating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        patch({ latitude, longitude, mapsUrl });
        setLococating(false);
      },
      (err) => {
        let msg = "Gagal mengambil lokasi. Silakan isi alamat manual.";
        if (err.code === err.PERMISSION_DENIED) msg = "Izin lokasi ditolak. Silakan isi alamat manual.";
        else if (err.code === err.TIMEOUT) msg = "Timeout. Coba lagi atau isi manual.";
        setGeoError(msg);
        setLococating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Lokasi Service</h2>
        <p className="text-sm text-slate-400">
          Alamat tujuan teknisi JARVIS.ID untuk datang ke lokasi Anda.
        </p>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
        <MapPin className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
        <div className="text-xs text-amber-200 leading-relaxed">
          <p className="font-semibold">KHUSUS CIMAHI & BANDUNG</p>
          <p>
            On-site service hanya tersedia di Cimahi & Bandung. Jika Anda di luar area ini, silakan
            kembali dan pilih opsi Kirim Unit.
          </p>
        </div>
      </div>

      {/* GPS */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-white">Gunakan Lokasi Saya</p>
            <p className="text-xs text-slate-400">Izinkan akses GPS untuk koordinat otomatis.</p>
          </div>
          <Button
            type="button"
            onClick={useMyLocation}
            disabled={locating}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white"
          >
            <Navigation className={`w-4 h-4 mr-2 ${locating ? "animate-pulse" : ""}`} />
            {locating ? "Mengambil..." : "USE MY LOCATION"}
          </Button>
        </div>
        {form.latitude !== null && form.longitude !== null && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10 border border-green-500/30">
            <span className="text-xs text-green-300 font-mono">
              ✓ {form.latitude.toFixed(6)}, {form.longitude.toFixed(6)}
            </span>
            {form.mapsUrl && (
              <a
                href={form.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 ml-auto"
              >
                Buka Maps <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}
        {geoError && (
          <p className="text-xs text-amber-400 mt-2">{geoError}</p>
        )}
      </div>

      {/* Manual address */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="serviceAddress" className="text-cyan-300 text-xs font-medium">
            Alamat Lengkap <span className="text-red-400">*</span>
          </Label>
          <Textarea
            id="serviceAddress"
            value={form.serviceAddress}
            onChange={(e) => patch({ serviceAddress: e.target.value })}
            placeholder="Jl. Contoh No. 123, RT/RW, Kelurahan, Kecamatan"
            className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 min-h-[80px]"
            maxLength={500}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="serviceLandmark" className="text-cyan-300 text-xs font-medium">
            Landmark / Patokan <span className="text-slate-500">(opsional)</span>
          </Label>
          <Input
            id="serviceLandmark"
            value={form.serviceLandmark}
            onChange={(e) => patch({ serviceLandmark: e.target.value })}
            placeholder="Contoh: dekat Indomaret, sebelah Masjid Al-Hikmah"
            className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 h-12"
            maxLength={200}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferredDate" className="text-cyan-300 text-xs font-medium">
            Tanggal Preferred <span className="text-slate-500">(opsional)</span>
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              id="preferredDate"
              type="date"
              value={form.preferredDate}
              onChange={(e) => patch({ preferredDate: e.target.value })}
              className="pl-10 bg-slate-900/60 border-slate-700 text-white focus:border-cyan-500 h-12"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferredTime" className="text-cyan-300 text-xs font-medium">
            Jam Preferred <span className="text-slate-500">(opsional)</span>
          </Label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              id="preferredTime"
              value={form.preferredTime}
              onChange={(e) => patch({ preferredTime: e.target.value })}
              placeholder="Contoh: 14.00 - 16.00"
              className="pl-10 bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 h-12"
              maxLength={40}
            />
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
        <AlertTriangle className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
        <p className="text-xs text-cyan-200/80 leading-relaxed">
          Form tetap bisa dilanjutkan tanpa GPS. Pastikan alamat manual Anda jelas dan mudah ditemukan.
        </p>
      </div>
    </div>
  );
}


