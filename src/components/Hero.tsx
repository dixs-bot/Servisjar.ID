"use client";

import { ArrowRight, MessageCircle, MapPin, Cpu, Wrench, Smartphone, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BUSINESS } from "@/lib/constants";
import { useNav } from "@/lib/nav-store";
import { openWhatsApp } from "@/lib/whatsapp";

export function Hero() {
  const { navigate, setInitialServiceArea } = useNav();

  const startOnSiteOrder = () => {
    setInitialServiceArea("ON_SITE");
    navigate({ name: "order" });
  };

  return (
    <section className="relative min-h-[100svh] flex items-center pt-20 pb-12 overflow-hidden jarvis-circuit-bg">
      {/* Background decorative elements */}
      <div className="absolute inset-0 jarvis-grid-pattern opacity-30" />
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl jarvis-float" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl jarvis-float" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Text */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6 jarvis-pulse">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-semibold tracking-wider text-cyan-300">
                {BUSINESS.brandName} • PROFESSIONAL ANDROID SERVICE
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              HP RUSAK?
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent jarvis-text-glow">
                KAMI DATANG
              </span>
              <br />
              KE LOKASI ANDA.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 mb-6 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Service HP panggilan, oprek Android, custom ROM, root/non-root, hardware service dan berbagai kebutuhan modifikasi smartphone.
            </p>

            {/* Location badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-8">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-semibold text-amber-300 tracking-wider">
                CIMAHI & BANDUNG
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0">
              <Button
                size="lg"
                onClick={startOnSiteOrder}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold h-12 px-6 jarvis-glow group"
              >
                PESAN SERVICE PANGGILAN
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => openWhatsApp()}
                className="bg-transparent border-green-500/40 text-green-400 hover:bg-green-500/10 hover:text-green-300 hover:border-green-400 h-12 px-6"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WHATSAPP JARVIS.ID
              </Button>
            </div>

            {/* Quick stats / trust signals */}
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-1.5 text-cyan-400 mb-1">
                  <Smartphone className="w-4 h-4" />
                  <span className="text-2xl font-bold text-white">13+</span>
                </div>
                <p className="text-[11px] text-slate-400 uppercase tracking-wider">Brand Didukung</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-1.5 text-cyan-400 mb-1">
                  <Wrench className="w-4 h-4" />
                  <span className="text-2xl font-bold text-white">20+</span>
                </div>
                <p className="text-[11px] text-slate-400 uppercase tracking-wider">Jenis Service</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-1.5 text-cyan-400 mb-1">
                  <Zap className="w-4 h-4" />
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <p className="text-[11px] text-slate-400 uppercase tracking-wider">Kota On-Site</p>
              </div>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative hidden lg:flex justify-center items-center">
            <div className="relative w-full max-w-md aspect-square">
              {/* Central device card */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-72 h-72 rounded-3xl jarvis-card-glass jarvis-border-glow jarvis-glow jarvis-pulse flex items-center justify-center">
                  <div className="absolute inset-0 jarvis-grid-pattern opacity-20 rounded-3xl" />
                  <Cpu className="w-32 h-32 text-cyan-400 jarvis-text-glow" />
                </div>
              </div>

              {/* Floating icon cards */}
              <div className="absolute top-4 left-4 w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center jarvis-float">
                <Smartphone className="w-9 h-9 text-cyan-400" />
              </div>
              <div className="absolute top-4 right-4 w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 flex items-center justify-center jarvis-float" style={{ animationDelay: "1s" }}>
                <Wrench className="w-9 h-9 text-blue-400" />
              </div>
              <div className="absolute bottom-4 left-4 w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-sm border border-green-500/30 flex items-center justify-center jarvis-float" style={{ animationDelay: "0.5s" }}>
                <Zap className="w-9 h-9 text-green-400" />
              </div>
              <div className="absolute bottom-4 right-4 w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 backdrop-blur-sm border border-amber-500/30 flex items-center justify-center jarvis-float" style={{ animationDelay: "1.5s" }}>
                <MapPin className="w-9 h-9 text-amber-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
