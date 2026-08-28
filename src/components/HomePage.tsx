"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Hero } from "@/components/Hero";
import { CallServiceSection } from "@/components/CallServiceSection";
import { ServiceAreaSection } from "@/components/ServiceAreaSection";
import { ServiceGrid } from "@/components/ServiceGrid";
import { HowItWorks } from "@/components/HowItWorks";
import { TrustSection } from "@/components/TrustSection";
import { CTASection } from "@/components/CTASection";

export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#050a17]">
      <Navbar />
      <main className="flex-grow pt-16 lg:pt-20">
        <Hero />
        <ServiceAreaSection />
        <CallServiceSection />
        <ServiceGrid />
        <HowItWorks />
        <TrustSection />
        <CTASection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
