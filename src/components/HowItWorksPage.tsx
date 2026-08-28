"use client";

import { ClipboardList, CheckCircle2, MessageSquare, Wrench, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { HowItWorks } from "@/components/HowItWorks";
import { useNav } from "@/lib/nav-store";

const STEPS = [
  { num: "01", icon: ClipboardList, title: "ISI FORM", desc: "Masukkan data HP dan keluhan." },
  { num: "02", icon: CheckCircle2, title: "KONFIRMASI", desc: "Data diterima JARVIS.ID." },
  { num: "03", icon: MessageSquare, title: "KONSULTASI", desc: "Admin/teknisi menghubungi customer." },
  { num: "04", icon: Wrench, title: "SERVICE", desc: "Teknisi datang atau unit diproses di counter." },
];

export function HowItWorksPage() {
  const { navigate, setInitialServiceArea } = useNav();

  return (
    <div className="min-h-screen flex flex-col bg-[#050a17]">
      <Navbar />
      <main className="flex-grow pt-16 lg:pt-20">
        <section className="relative py-16 sm:py-20 jarvis-circuit-bg overflow-hidden">
          <div className="absolute inset-0 jarvis-grid-pattern opacity-30" />
          <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6">
              <span className="text-xs font-semibold tracking-wider text-cyan-300">PROSES SERVICE</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              How It{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent jarvis-text-glow">
                Works
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Empat langkah mudah untuk menyelesaikan keluhan HP Anda bersama JARVIS.ID.
            </p>
          </div>
        </section>

        <HowItWorks />

        {/* Detailed steps */}
        <section className="py-16 sm:py-20 bg-[#050a17]">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="space-y-4">
              {STEPS.map((s) => (
                <div
                  key={s.num}
                  className="flex flex-col sm:flex-row gap-4 p-6 rounded-2xl bg-slate-900/40 border border-cyan-500/10 hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex items-center gap-4 sm:flex-col sm:items-center sm:w-32 sm:shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center jarvis-glow">
                      <s.icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-cyan-400">{s.num}</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-20 bg-gradient-to-b from-[#0a1428] to-[#050a17]">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Siap Memulai?</h2>
            <p className="text-base text-slate-300 mb-8">
              Isi form sekarang, tim JARVIS.ID akan menghubungi Anda segera.
            </p>
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
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
