"use client";

import { MapPin, Clock, User, Smartphone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNav } from "@/lib/nav-store";

const FEATURES = [
  { icon: MapPin, label: "LOCATION SERVICE", desc: "Teknisi datang ke lokasi Anda di Cimahi & Bandung" },
  { icon: Clock, label: "TIME SAVING", desc: "Tidak perlu antre atau datang ke counter" },
  { icon: User, label: "PROFESSIONAL TECHNICIAN", desc: "Ditangani teknisi berpengalaman Android" },
  { icon: Smartphone, label: "MULTIPLE ANDROID DEVICES", desc: "Samsung, Xiaomi, OPPO, Vivo, Realme, dan lainnya" },
];

export function CallServiceSection() {
  const { navigate, setInitialServiceArea } = useNav();

  const handleCTA = () => {
    setInitialServiceArea("ON_SITE");
    navigate({ name: "order" });
  };

  return (
    <section className="py-16 sm:py-20 bg-[#050a17] relative overflow-hidden">
      <div className="absolute inset-0 jarvis-grid-pattern opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-4">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-semibold tracking-wider text-cyan-300">KHUSUS CIMAHI & BANDUNG</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            SERVICE HP{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">PANGGILAN</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Tidak sempat datang ke counter? Teknisi JARVIS.ID siap datang ke lokasi Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          {FEATURES.map((f, i) => (
            <div
              key={f.label}
              className="jarvis-card-glass rounded-2xl p-6 text-center hover:jarvis-border-glow transition-all group"
            >
              <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2 tracking-wider">{f.label}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            onClick={handleCTA}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold h-12 px-8 jarvis-glow group"
          >
            PANGGIL TEKNISI
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}
