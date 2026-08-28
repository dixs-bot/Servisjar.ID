"use client";

import { Shield, Lock, Eye, FileText, Truck, MapPin } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: Shield,
    title: "Privacy First",
    desc: "Data customer hanya digunakan untuk konsultasi & pelayanan service.",
  },
  {
    icon: Lock,
    title: "Secure Storage",
    desc: "File media disimpan di bucket private dengan akses terbatas.",
  },
  {
    icon: Eye,
    title: "Transparent Process",
    desc: "Status service dapat dilacak dari New hingga Completed.",
  },
  {
    icon: FileText,
    title: "Validated Data",
    desc: "Validasi server-side menggunakan Zod schema yang ketat.",
  },
  {
    icon: Truck,
    title: "Send-Device Option",
    desc: "Customer luar Cimahi & Bandung bisa kirim unit ke counter.",
  },
  {
    icon: MapPin,
    title: "On-Site Service",
    desc: "Teknisi datang ke lokasi customer di Cimahi & Bandung.",
  },
];

export function TrustSection() {
  return (
    <section className="py-16 sm:py-20 bg-[#050a17]">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-4">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-semibold tracking-wider text-cyan-300">KENAPA JARVIS.ID</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Trust &{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Transparansi</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {TRUST_ITEMS.map((item, i) => (
            <div
              key={i}
              className="jarvis-card-glass rounded-2xl p-5 sm:p-6 flex gap-4 items-start hover:jarvis-border-glow transition-all"
            >
              <div className="w-10 h-10 shrink-0 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
