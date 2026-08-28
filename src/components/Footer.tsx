"use client";

import { Cpu, MessageCircle, Mail, MapPin, Shield, Clock } from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { useNav } from "@/lib/nav-store";
import { openWhatsApp } from "@/lib/whatsapp";

export function Footer() {
  const { navigate, setInitialServiceArea } = useNav();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#050a17] border-t border-cyan-500/20 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center jarvis-glow">
                <Cpu className="w-6 h-6 text-[#050a17]" />
              </div>
              <div>
                <div className="text-xl font-bold text-white tracking-wider">
                  JARVIS<span className="text-cyan-400">.ID</span>
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-300/70">Android Service</div>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {BUSINESS.tagline}
              <br />
              {BUSINESS.subTagline}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs text-cyan-300 font-medium">PROFESSIONAL ANDROID SERVICE</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Navigasi</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => navigate({ name: "home" })} className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: "services" })} className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: "service-panggilan" })} className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Service Panggilan
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: "how-it-works" })} className="text-slate-400 hover:text-cyan-400 transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setInitialServiceArea(null);
                    navigate({ name: "order" });
                  }}
                  className="text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  Order Service
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: "privacy" })} className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Kontak</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <button
                  onClick={() => openWhatsApp()}
                  className="flex items-start gap-3 text-slate-400 hover:text-cyan-400 transition-colors text-left"
                >
                  <MessageCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                  <span>
                    <span className="block text-xs text-slate-500">WhatsApp</span>
                    <span className="font-mono text-white">{BUSINESS.whatsappDisplay}</span>
                  </span>
                </button>
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <Clock className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <span>
                  <span className="block text-xs text-slate-500">Jam Operasional</span>
                  <span className="text-white">Senin – Sabtu, 10.00 – 20.00 WIB</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Address */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Counter</h3>
            <div className="flex items-start gap-3 text-sm text-slate-400">
              <MapPin className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              <div className="space-y-0.5">
                <p className="text-white font-medium">{BUSINESS.counter.name}</p>
                <p>{BUSINESS.counter.building}</p>
                <p>{BUSINESS.counter.street}</p>
                <p>{BUSINESS.counter.rtRw}</p>
                <p>{BUSINESS.counter.village}</p>
                <p>{BUSINESS.counter.district}</p>
                <p>{BUSINESS.counter.city}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-cyan-500/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {year} JARVIS.ID. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <button onClick={() => navigate({ name: "privacy" })} className="hover:text-cyan-400 transition-colors">
              Privacy Policy
            </button>
            <span className="text-slate-700">•</span>
            <button onClick={() => navigate({ name: "admin" })} className="hover:text-cyan-400 transition-colors">
              Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
