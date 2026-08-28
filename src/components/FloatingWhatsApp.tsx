"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { openWhatsApp } from "@/lib/whatsapp";

export function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
      }`}
    >
      {expanded ? (
        <div className="bg-[#050a17] border border-green-500/30 rounded-2xl shadow-2xl shadow-green-500/20 p-4 w-72 max-w-[calc(100vw-2rem)]">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Chat JARVIS.ID</p>
                <p className="text-xs text-green-400">Online sekarang</p>
              </div>
            </div>
            <button
              onClick={() => setExpanded(false)}
              className="text-slate-400 hover:text-white p-1"
              aria-label="Tutup chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-300 mb-3 leading-relaxed">
            Halo! Ada keluhan HP? Tim JARVIS.ID siap membantu. Klik tombol di bawah untuk mulai chat WhatsApp.
          </p>
          <button
            onClick={() => {
              openWhatsApp();
              setExpanded(false);
            }}
            className="w-full py-2.5 rounded-lg bg-green-500 hover:bg-green-400 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Buka WhatsApp
          </button>
          <p className="text-[10px] text-slate-500 text-center mt-2 font-mono">{BUSINESS.whatsappDisplay}</p>
        </div>
      ) : (
        <button
          onClick={() => setExpanded(true)}
          className="group flex items-center gap-2 bg-green-500 hover:bg-green-400 rounded-full shadow-2xl shadow-green-500/40 transition-all pl-3 pr-4 py-3 sm:py-3.5"
          aria-label="Buka chat WhatsApp JARVIS.ID"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-green-500 animate-pulse" />
          </div>
          <span className="hidden sm:inline text-white text-sm font-semibold pr-1">CHAT JARVIS.ID</span>
        </button>
      )}
    </div>
  );
}
