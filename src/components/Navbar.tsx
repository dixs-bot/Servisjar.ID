"use client";

import { useState, useEffect } from "react";
import { Menu, X, Cpu, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { useNav } from "@/lib/nav-store";
import { BUSINESS } from "@/lib/constants";
import { openWhatsApp } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const NAV_ITEMS: Array<{ label: string; route: Parameters<ReturnType<typeof useNav>["navigate"]>[0] }> = [
  { label: "Home", route: { name: "home" } },
  { label: "Services", route: { name: "services" } },
  { label: "On-Site Service", route: { name: "service-panggilan" } },
  { label: "How It Works", route: { name: "how-it-works" } },
];

export function Navbar() {
  const { route, navigate, setInitialServiceArea } = useNav();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (name: string) => route.name === name;

  const handleOrder = () => {
    setInitialServiceArea(null);
    navigate({ name: "order" });
    setOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-[#050a17]/95 backdrop-blur-md border-b border-cyan-500/20 shadow-lg shadow-cyan-500/5"
          : "bg-[#050a17]/80 backdrop-blur-sm border-b border-transparent"
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button
            onClick={() => navigate({ name: "home" })}
            className="flex items-center gap-2 sm:gap-3 group"
            aria-label="JARVIS.ID home"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center jarvis-glow group-hover:jarvis-glow-strong transition-all">
              <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-[#050a17]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-lg sm:text-xl font-bold tracking-wider text-white leading-none">
                JARVIS<span className="text-cyan-400">.ID</span>
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-cyan-300/70 leading-none mt-1">
                Android Service
              </span>
            </div>
          </button>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.route)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-all",
                  isActive(item.route.name)
                    ? "text-cyan-400 bg-cyan-500/10"
                    : "text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/5"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openWhatsApp()}
              className="bg-transparent border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 hover:text-cyan-200 hover:border-cyan-400"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            <Button
              size="sm"
              onClick={handleOrder}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold jarvis-glow"
            >
              PESAN SERVICE
            </Button>
          </div>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:bg-cyan-500/10"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[85vw] max-w-sm bg-[#050a17] border-cyan-500/20 p-0"
            >
              <SheetTitle className="sr-only">Menu Navigasi JARVIS.ID</SheetTitle>
              <div className="flex items-center justify-between p-5 border-b border-cyan-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-[#050a17]" />
                  </div>
                  <span className="text-white font-bold">
                    JARVIS<span className="text-cyan-400">.ID</span>
                  </span>
                </div>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-cyan-500/10">
                    <X className="w-5 h-5" />
                  </Button>
                </SheetClose>
              </div>
              <div className="flex flex-col p-4 gap-1">
                {NAV_ITEMS.map((item) => (
                  <SheetClose asChild key={item.label}>
                    <button
                      onClick={() => navigate(item.route)}
                      className={cn(
                        "text-left px-4 py-3 rounded-md text-sm font-medium transition-all",
                        isActive(item.route.name)
                          ? "text-cyan-400 bg-cyan-500/10"
                          : "text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/5"
                      )}
                    >
                      {item.label}
                    </button>
                  </SheetClose>
                ))}
                <div className="h-px bg-cyan-500/10 my-3" />
                <SheetClose asChild>
                  <button
                    onClick={() => openWhatsApp()}
                    className="text-left px-4 py-3 rounded-md text-sm font-medium text-green-400 hover:bg-green-500/10 flex items-center gap-3"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp JARVIS.ID
                  </button>
                </SheetClose>
                <SheetClose asChild>
                  <button
                    onClick={handleOrder}
                    className="mt-2 px-4 py-3 rounded-md text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-center jarvis-glow"
                  >
                    PESAN SERVICE
                  </button>
                </SheetClose>
                <div className="mt-6 px-4 py-3 rounded-md bg-cyan-500/5 border border-cyan-500/20">
                  <p className="text-[10px] uppercase tracking-wider text-cyan-400/70 mb-1">Official WhatsApp</p>
                  <p className="text-sm text-white font-mono">{BUSINESS.whatsappDisplay}</p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
