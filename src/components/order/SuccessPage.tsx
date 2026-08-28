"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, MessageCircle, Copy, Check, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNav } from "@/lib/nav-store";
import { useOrderWizard } from "@/lib/order-wizard-store";
import { openWhatsApp, createWhatsAppMessage } from "@/lib/whatsapp";
import type { OrderRecord, ApiResponse } from "@/lib/types";

export function SuccessPage({ orderNumber }: { orderNumber: string }) {
  const { navigate } = useNav();
  const { reset } = useOrderWizard();
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/orders/by-number?orderNumber=${encodeURIComponent(orderNumber)}`);
        const json: ApiResponse<OrderRecord> = await res.json();
        if (mounted && json.success && json.data) {
          setOrder(json.data);
        }
      } catch {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [orderNumber]);

  const handleWhatsApp = () => {
    if (order) {
      openWhatsApp(createWhatsAppMessage(order));
    } else {
      openWhatsApp(`Hallo JARVIS.ID, saya baru saja submit order dengan nomor ${orderNumber}.`);
    }
  };

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleBackHome = () => {
    reset();
    navigate({ name: "home" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050a17]">
      {/* Header */}
      <header className="bg-[#050a17] border-b border-cyan-500/20">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl h-16 lg:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center jarvis-glow">
              <svg className="w-5 h-5 text-[#050a17]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <rect x="9" y="9" width="6" height="6" />
              </svg>
            </div>
            <span className="text-base font-bold text-white tracking-wider">
              JARVIS<span className="text-cyan-400">.ID</span>
            </span>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="rounded-3xl bg-gradient-to-br from-[#0a1428] to-[#0c2461] border border-cyan-500/30 p-6 sm:p-10 text-center jarvis-glow">
            {/* Success icon */}
            <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mb-6 jarvis-pulse">
              <CheckCircle2 className="w-12 h-12 text-green-400" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              PERMINTAAN SERVICE TERKIRIM
            </h1>
            <p className="text-sm text-slate-300 mb-6">
              Data service Anda telah diterima oleh JARVIS.ID.
            </p>

            {/* Order number */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 mb-6">
              <p className="text-xs text-cyan-300 uppercase tracking-wider mb-1">Nomor Order</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-lg sm:text-xl font-mono font-bold text-white break-all">
                  {orderNumber}
                </p>
                <button
                  onClick={copyOrderNumber}
                  className="text-slate-400 hover:text-cyan-400 shrink-0"
                  aria-label="Salin nomor order"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loading ? (
              <div className="py-4 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
              </div>
            ) : order ? (
              <div className="text-left mb-6 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Tipe Service</span>
                  <span className="text-white font-medium">
                    {order.serviceArea === "ON_SITE" ? "Service Panggilan" : "Kirim Unit"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Status Order</span>
                  <span className="text-cyan-300 font-medium">Order Baru</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Status Pembayaran</span>
                  <span className="text-amber-300 font-medium">
                    {order.paymentMethod === "TRANSFER" ? "Menunggu Verifikasi" : "Belum Bayar"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Media Upload</span>
                  <span className="text-white font-medium">
                    {order.mediaCounts?.photos || 0} foto • {order.mediaCounts?.videos || 0} video
                  </span>
                </div>
              </div>
            ) : null}

            {order?.serviceArea === "SEND_DEVICE" && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-6">
                <p className="text-xs text-amber-200 leading-relaxed">
                  ⚠ Anda akan menerima konfirmasi via WhatsApp. <strong>Jangan mengirim unit sebelum dikonfirmasi admin.</strong>
                </p>
              </div>
            )}

            {/* CTAs */}
            <div className="space-y-3">
              <Button
                size="lg"
                onClick={handleWhatsApp}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold h-12"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                BUKA WHATSAPP
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleBackHome}
                className="w-full bg-transparent border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 hover:text-cyan-200 h-12"
              >
                Kembali ke Beranda
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <p className="text-[10px] text-slate-500 mt-6">
              Simpan nomor order Anda untuk pengecekan status via WhatsApp.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-[#050a17] border-t border-cyan-500/10 py-4">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} JARVIS.ID • Service HP Panggilan & Oprek Android</p>
        </div>
      </footer>
    </div>
  );
}
