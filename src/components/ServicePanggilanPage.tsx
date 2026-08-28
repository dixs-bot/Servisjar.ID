"use client";

import { MapPin, Clock, User, Smartphone, ArrowRight, AlertTriangle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { useNav } from "@/lib/nav-store";
import { BUSINESS } from "@/lib/constants";
import { openWhatsApp } from "@/lib/whatsapp";

const FEATURES = [
  { icon: MapPin, label: "LOCATION SERVICE", desc: "Teknisi datang ke lokasi Anda di Cimahi & Bandung. Tidak perlu ke counter." },
  { icon: Clock, label: "TIME SAVING", desc: "Hemat waktu — tanpa antre, tanpa pergi ke counter. Teknisi datang sesuai jadwal." },
  { icon: User, label: "PROFESSIONAL TECHNICIAN", desc: "Ditangani langsung oleh teknisi berpengalaman di bidang Android." },
  { icon: Smartphone, label: "MULTIPLE ANDROID DEVICES", desc: "Samsung, Xiaomi, Redmi, POCO, OPPO, Vivo, Realme, Infinix, Tecno, Huawei, Asus, OnePlus, dan lainnya." },
];

export function ServicePanggilanPage() {
  const { navigate, setInitialServiceArea } = useNav();

  return (
    <div className="min-h-screen flex flex-col bg-[#050a17]">
      <Navbar />
      <main className="flex-grow pt-16 lg:pt-20">
        {/* Hero */}
        <section className="relative py-16 sm:py-20 jarvis-circuit-bg overflow-hidden">
          <div className="absolute inset-0 jarvis-grid-pattern opacity-30" />
          <div className="absolute top-1/4 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl jarvis-float" />
          <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6 jarvis-pulse">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-semibold tracking-wider text-amber-300">KHUSUS CIMAHI & BANDUNG</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                SERVICE HP{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent jarvis-text-glow">
                  PANGGILAN
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed">
                Tidak sempat datang ke counter? Teknisi JARVIS.ID siap datang ke lokasi Anda di
                Cimahi dan Bandung untuk menangani service HP, oprek Android, custom ROM, root, dan
                hardware service.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <Button
                  size="lg"
                  onClick={() => {
                    setInitialServiceArea("ON_SITE");
                    navigate({ name: "order" });
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold h-12 px-8 jarvis-glow group"
                >
                  PANGGIL TEKNISI
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => openWhatsApp()}
                  className="bg-transparent border-green-500/40 text-green-400 hover:bg-green-500/10 hover:text-green-300 h-12 px-8"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 sm:py-20 bg-[#050a17]">
          <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {FEATURES.map((f, i) => (
                <div key={i} className="jarvis-card-glass rounded-2xl p-6 hover:jarvis-border-glow transition-all">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center mb-4">
                    <f.icon className="w-7 h-7 text-cyan-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 tracking-wider text-center">{f.label}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed text-center">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Area info */}
        <section className="py-16 sm:py-20 bg-gradient-to-b from-[#050a17] to-[#0a1428]">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/30 p-8 sm:p-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-6">
                <AlertTriangle className="w-8 h-8 text-amber-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Area On-Site Service</h2>
              <p className="text-base text-slate-300 mb-6 max-w-2xl mx-auto leading-relaxed">
                Service panggilan saat ini hanya tersedia di <strong className="text-amber-300">Cimahi</strong> dan{" "}
                <strong className="text-amber-300">Bandung</strong>. Jika Anda berada di luar area ini,
                silakan gunakan opsi Kirim Unit ke counter.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => {
                    setInitialServiceArea("ON_SITE");
                    navigate({ name: "order" });
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold"
                >
                  PESAN SERVICE PANGGILAN
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setInitialServiceArea("SEND_DEVICE");
                    navigate({ name: "order" });
                  }}
                  className="bg-transparent border-amber-500/40 text-amber-300 hover:bg-amber-500/10 hover:text-amber-200"
                >
                  KONSULTASI & KIRIM UNIT
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-16 sm:py-20 bg-[#050a17]">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Alur Service Panggilan</h2>
              <p className="text-base text-slate-300">Empat langkah mudah dari request hingga teknisi datang.</p>
            </div>
            <ol className="space-y-4">
              {[
                { num: "01", title: "Pilih Service Panggilan", desc: "Mulai isi form order dengan tipe service ON_SITE." },
                { num: "02", title: "Lengkapi Data & Media", desc: "Masukkan data customer, device, kerusakan, dan upload foto/video." },
                { num: "03", title: "Konfirmasi via WhatsApp", desc: "Admin JARVIS.ID akan menghubungi Anda untuk konfirmasi & penjadwalan." },
                { num: "04", title: "Teknisi Datang", desc: "Teknisi datang ke lokasi sesuai jadwal yang disepakati." },
              ].map((s) => (
                <li key={s.num} className="flex gap-4 p-5 rounded-2xl bg-slate-900/40 border border-cyan-500/10">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold jarvis-glow">
                    {s.num}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">{s.title}</h3>
                    <p className="text-sm text-slate-400">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 sm:py-20 bg-gradient-to-b from-[#0a1428] to-[#050a17]">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Punya Pertanyaan?</h2>
            <p className="text-base text-slate-300 mb-8">
              Chat WhatsApp JARVIS.ID untuk konsultasi gratis sebelum order.
            </p>
            <Button
              size="lg"
              onClick={() => openWhatsApp()}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold h-12 px-8"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              WHATSAPP: {BUSINESS.whatsappDisplay}
            </Button>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
