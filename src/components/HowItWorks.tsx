"use client";

import { ClipboardList, CheckCircle2, MessageSquare, Wrench } from "lucide-react";

const STEPS = [
  {
    num: "01",
    icon: ClipboardList,
    title: "ISI FORM",
    desc: "Masukkan data HP dan keluhan.",
  },
  {
    num: "02",
    icon: CheckCircle2,
    title: "KONFIRMASI",
    desc: "Data diterima JARVIS.ID.",
  },
  {
    num: "03",
    icon: MessageSquare,
    title: "KONSULTASI",
    desc: "Admin/teknisi menghubungi customer.",
  },
  {
    num: "04",
    icon: Wrench,
    title: "SERVICE",
    desc: "Teknisi datang atau unit diproses di counter.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 sm:py-20 bg-[#050a17] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-4">
            <span className="text-xs font-semibold tracking-wider text-cyan-300">PROSES SERVICE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            How It{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-base text-slate-300 max-w-2xl mx-auto">
            Empat langkah mudah untuk menyelesaikan keluhan HP Anda.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-cyan-500/0 via-cyan-500/40 to-cyan-500/0" />

          {STEPS.map((step, i) => (
            <div key={step.num} className="relative">
              <div className="flex flex-col items-center text-center group">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#0a1428] to-[#0c2461] border border-cyan-500/30 flex items-center justify-center group-hover:jarvis-glow transition-all">
                    <step.icon className="w-10 h-10 text-cyan-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs jarvis-glow">
                    {step.num}
                  </div>
                </div>
                <h3 className="text-base font-bold text-white mb-2 tracking-wider">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
