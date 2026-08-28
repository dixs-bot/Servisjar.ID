"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNav } from "@/lib/nav-store";
import { openWhatsApp } from "@/lib/whatsapp";

export function CTASection() {
  const { navigate, setInitialServiceArea } = useNav();

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-[#0a1428] to-[#050a17] relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl relative z-10">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/30 via-blue-700/20 to-cyan-600/30" />
          <div className="absolute inset-0 jarvis-grid-pattern opacity-30" />
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" />

          <div className="relative p-8 sm:p-12 lg:p-16 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Siap Service HP Anda?
            </h2>
            <p className="text-base sm:text-lg text-cyan-100/80 mb-8 max-w-2xl mx-auto">
              Isi form sekarang, tim JARVIS.ID akan menghubungi Anda untuk konfirmasi dan penjadwalan.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <Button
                size="lg"
                onClick={() => {
                  setInitialServiceArea(null);
                  navigate({ name: "order" });
                }}
                className="bg-white text-blue-900 hover:bg-cyan-50 font-semibold h-12 px-8 group"
              >
                PESAN SERVICE
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => openWhatsApp()}
                className="bg-transparent border-green-400/40 text-green-300 hover:bg-green-500/10 hover:text-green-200 hover:border-green-400 h-12 px-8"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WHATSAPP
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
