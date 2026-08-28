"use client";

import { Shield, Lock, Eye, FileText, Database, UserCheck } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { BUSINESS } from "@/lib/constants";

export function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#050a17]">
      <Navbar />
      <main className="flex-grow pt-16 lg:pt-20">
        <section className="relative py-16 sm:py-20 jarvis-circuit-bg overflow-hidden">
          <div className="absolute inset-0 jarvis-grid-pattern opacity-30" />
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs font-semibold tracking-wider text-cyan-300">PRIVACY POLICY</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
                Kebijakan{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Privasi
                </span>
              </h1>
              <p className="text-sm text-slate-400">
                Terakhir diperbarui: {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>

            <div className="rounded-3xl bg-[#0a1428]/80 backdrop-blur border border-cyan-500/20 p-6 sm:p-10">
              {/* Consent */}
              <div className="p-5 rounded-2xl bg-cyan-500/5 border border-cyan-500/30 mb-8">
                <div className="flex items-start gap-3">
                  <UserCheck className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-white mb-1">Consent yang Anda Berikan</p>
                    <p className="text-sm text-slate-300 italic leading-relaxed">
                      "Saya menyetujui data yang saya masukkan digunakan untuk keperluan konsultasi,
                      konfirmasi, dan pelayanan service HP JARVIS.ID."
                    </p>
                  </div>
                </div>
              </div>

              <div className="prose prose-invert max-w-none space-y-8">
                <Section
                  icon={Database}
                  title="1. Data yang Dikumpulkan"
                >
                  <p>
                    JARVIS.ID mengumpulkan data yang Anda berikan secara sukarela melalui form order service, meliputi:
                  </p>
                  <ul className="space-y-1.5 ml-4 list-disc text-slate-300">
                    <li>Data customer: nama, nomor WhatsApp, email (opsional), kota, provinsi.</li>
                    <li>Data device: brand, model, IMEI (opsional), kondisi device.</li>
                    <li>Detail service: jenis service yang dipilih, deskripsi kerusakan, riwayat device.</li>
                    <li>Media: foto dan video kerusakan device yang Anda upload.</li>
                    <li>Lokasi: alamat, landmark, koordinat GPS (hanya untuk service panggilan).</li>
                    <li>Data pembayaran: metode pembayaran dan bukti transfer (jika transfer).</li>
                  </ul>
                </Section>

                <Section
                  icon={Eye}
                  title="2. Penggunaan Data"
                >
                  <p>
                    Data Anda digunakan secara eksklusif untuk:
                  </p>
                  <ul className="space-y-1.5 ml-4 list-disc text-slate-300">
                    <li>Konsultasi dan konfirmasi kebutuhan service HP.</li>
                    <li>Penjadwalan kunjungan teknisi (untuk service panggilan).</li>
                    <li>Komunikasi terkait progress service via WhatsApp.</li>
                    <li>Verifikasi pembayaran (untuk pembayaran transfer).</li>
                    <li>Penyediaan informasi pengiriman unit (untuk service luar daerah).</li>
                  </ul>
                  <p>
                    JARVIS.ID tidak akan menggunakan data Anda untuk tujuan pemasaran atau dibagikan
                    ke pihak ketiga di luar keperluan service.
                  </p>
                </Section>

                <Section
                  icon={Lock}
                  title="3. Penyimpanan & Keamanan Data"
                >
                  <p>
                    Data Anda disimpan dengan menerapkan praktik keamanan standar industri:
                  </p>
                  <ul className="space-y-1.5 ml-4 list-disc text-slate-300">
                    <li>Database dilindungi dengan Row Level Security (RLS).</li>
                    <li>File media disimpan di storage bucket private.</li>
                    <li>Akses ke data customer dibatasi hanya untuk admin JARVIS.ID.</li>
                    <li>Validasi server-side menggunakan Zod schema yang ketat.</li>
                    <li>Sanitasi input dan pencegahan injection attack.</li>
                    <li>Validasi tipe file (MIME) dan ukuran upload untuk mencegah abuse.</li>
                  </ul>
                  <p>
                    Customer tidak dapat membaca order milik customer lain. Setiap order hanya dapat
                    diakses oleh pemilik order (melalui nomor order) dan admin JARVIS.ID.
                  </p>
                </Section>

                <Section
                  icon={FileText}
                  title="4. Retensi Data"
                >
                  <p>
                    Data order disimpan selama diperlukan untuk keperluan service dan dokumentasi.
                    Jika Anda ingin data order Anda dihapus, silakan hubungi JARVIS.ID via WhatsApp
                    dengan menyertakan nomor order Anda.
                  </p>
                </Section>

                <Section
                  icon={UserCheck}
                  title="5. Hak Anda"
                >
                  <p>Anda memiliki hak untuk:</p>
                  <ul className="space-y-1.5 ml-4 list-disc text-slate-300">
                    <li>Mengakses data yang Anda berikan ke JARVIS.ID.</li>
                    <li>Meminta koreksi data yang tidak akurat.</li>
                    <li>Meminta penghapusan data order (dengan pengecualian data yang wajib disimpan by hukum).</li>
                    <li>Menarik consent kapan saja (dengan konsekuensi service tidak dapat dilanjutkan).</li>
                  </ul>
                </Section>

                <Section
                  icon={Shield}
                  title="6. Perubahan Kebijakan"
                >
                  <p>
                    JARVIS.ID berhak memperbarui kebijakan privasi ini sewaktu-waktu sesuai kebutuhan
                    operasional dan regulasi. Perubahan akan diumumkan di halaman ini dengan tanggal
                    pembaruan terbaru.
                  </p>
                </Section>

                <Section
                  icon={FileText}
                  title="7. Kontak"
                >
                  <p>
                    Untuk pertanyaan terkait privasi data Anda, silakan hubungi JARVIS.ID:
                  </p>
                  <div className="mt-3 p-4 rounded-lg bg-slate-900/60 border border-cyan-500/20">
                    <p className="text-sm text-slate-300">
                      <span className="text-cyan-400">WhatsApp:</span> {BUSINESS.whatsappDisplay}
                    </p>
                    <p className="text-sm text-slate-300 mt-1">
                      <span className="text-cyan-400">Counter:</span> {BUSINESS.counter.name}, {BUSINESS.counter.street}, {BUSINESS.counter.city}
                    </p>
                  </div>
                </Section>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-cyan-400" />
        </div>
        <h2 className="text-lg font-bold text-white">{title}</h2>
      </div>
      <div className="ml-12 text-sm text-slate-300 leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}
