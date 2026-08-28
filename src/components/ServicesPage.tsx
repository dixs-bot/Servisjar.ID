"use client";

import { Cpu, HardDrive, ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { ServiceGrid } from "@/components/ServiceGrid";
import { useNav } from "@/lib/nav-store";
import { openWhatsApp } from "@/lib/whatsapp";

export function ServicesPage() {
  const { navigate, setInitialServiceArea } = useNav();

  return (
    <div className="min-h-screen flex flex-col bg-[#050a17]">
      <Navbar />
      <main className="flex-grow pt-16 lg:pt-20">
        {/* Hero */}
        <section className="relative py-16 sm:py-20 jarvis-circuit-bg overflow-hidden">
          <div className="absolute inset-0 jarvis-grid-pattern opacity-30" />
          <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6 jarvis-pulse">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-semibold tracking-wider text-cyan-300">LAYANAN JARVIS.ID</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Software &{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent jarvis-text-glow">
                Hardware Service
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Berbagai layanan modifikasi dan perbaikan Android oleh teknisi berpengalaman.
              Oprek, custom ROM, root, hardware, dan banyak lagi.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                onClick={() => {
                  setInitialServiceArea(null);
                  navigate({ name: "order" });
                }}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold h-12 px-8 jarvis-glow group"
              >
                PESAN SERVICE
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => openWhatsApp()}
                className="bg-transparent border-green-500/40 text-green-400 hover:bg-green-500/10 hover:text-green-300 h-12 px-8"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Konsultasi
              </Button>
            </div>
          </div>
        </section>

        {/* Service grid */}
        <ServiceGrid />

        {/* CTA */}
        <section className="py-16 sm:py-20 bg-gradient-to-b from-[#0a1428] to-[#050a17]">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Tidak Yakin Service Mana?</h2>
            <p className="text-base text-slate-300 mb-8">
              Chat JARVIS.ID — teknisi akan bantu identifikasi kebutuhan service Anda.
            </p>
            <Button
              size="lg"
              onClick={() => openWhatsApp()}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold h-12 px-8"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Konsultasi Gratis
            </Button>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
