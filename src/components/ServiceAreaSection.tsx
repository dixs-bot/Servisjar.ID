"use client";

import { MapPin, Package, ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNav } from "@/lib/nav-store";

export function ServiceAreaSection() {
  const { navigate, setInitialServiceArea } = useNav();

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-[#050a17] to-[#0a1428] relative">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Pilih Metode{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Service</span>
          </h2>
          <p className="text-base text-slate-300 max-w-2xl mx-auto">
            Dua opsi layanan: teknisi datang ke lokasi Anda, atau kirim unit ke counter JARVIS.ID.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {/* Card 1: On-site */}
          <div className="relative group rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-sm border border-cyan-500/30 rounded-3xl" />
            <div className="relative p-8 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">SERVICE PANGGILAN</h3>
                  <p className="text-sm text-cyan-300">CIMAHI & BANDUNG</p>
                </div>
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed flex-grow">
                Teknisi datang ke lokasi Anda. Cocok untuk customer di area Cimahi dan Bandung yang tidak sempat datang ke counter.
              </p>
              <Button
                size="lg"
                onClick={() => {
                  setInitialServiceArea("ON_SITE");
                  navigate({ name: "order" });
                }}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold w-full jarvis-glow group"
              >
                PESAN SERVICE PANGGILAN
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Card 2: Send device */}
          <div className="relative group rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-600/20 backdrop-blur-sm border border-amber-500/30 rounded-3xl" />
            <div className="relative p-8 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                  <Package className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">KIRIM UNIT</h3>
                  <p className="text-sm text-amber-300">LUAR CIMAHI & BANDUNG</p>
                </div>
              </div>
              <p className="text-slate-300 mb-4 leading-relaxed flex-grow">
                Isi form terlebih dahulu. Tunggu konfirmasi sebelum mengirim perangkat.
              </p>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-6">
                <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  Jangan mengirim unit sebelum mendapatkan konfirmasi dari JARVIS.ID.
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => {
                  setInitialServiceArea("SEND_DEVICE");
                  navigate({ name: "order" });
                }}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-semibold w-full shadow-lg shadow-amber-500/30 group"
              >
                KONSULTASI & KIRIM UNIT
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
