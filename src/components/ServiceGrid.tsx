"use client";

import { Cpu, HardDrive, Wrench, Battery, Zap, Smartphone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SOFTWARE_SERVICES, HARDWARE_SERVICES } from "@/lib/constants";

export function ServiceGrid() {
  return (
    <section className="py-16 sm:py-20 bg-[#0a1428] relative">
      <div className="absolute inset-0 jarvis-grid-pattern opacity-10" />
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-4">
            <Wrench className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-semibold tracking-wider text-cyan-300">LAYANAN JARVIS.ID</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Software &{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Hardware Service</span>
          </h2>
          <p className="text-base text-slate-300 max-w-2xl mx-auto">
            Berbagai layanan modifikasi dan perbaikan Android oleh teknisi berpengalaman.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Software */}
          <Card className="bg-[#050a17]/60 border-cyan-500/20 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                <Cpu className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">SOFTWARE SERVICES</h3>
                <p className="text-xs text-cyan-300/70 uppercase tracking-wider">Modifikasi & Optimasi</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SOFTWARE_SERVICES.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/5 border border-cyan-500/10 hover:border-cyan-500/30 hover:bg-cyan-500/10 transition-all"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span className="text-sm text-slate-200">{s.label}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Hardware */}
          <Card className="bg-[#050a17]/60 border-amber-500/20 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                <HardDrive className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">HARDWARE SERVICES</h3>
                <p className="text-xs text-amber-300/70 uppercase tracking-wider">Penggantian & Perbaikan Fisik</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {HARDWARE_SERVICES.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/5 border border-amber-500/10 hover:border-amber-500/30 hover:bg-amber-500/10 transition-all"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="text-sm text-slate-200">{s.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick icons row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          {[
            { icon: Smartphone, label: "Semua Brand Android" },
            { icon: Cpu, label: "Oprek & Custom ROM" },
            { icon: Battery, label: "Ganti Baterai & LCD" },
            { icon: Zap, label: "Heatsink & Modding" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#050a17]/40 border border-cyan-500/10">
              <item.icon className="w-5 h-5 text-cyan-400 shrink-0" />
              <span className="text-xs text-slate-300 font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
