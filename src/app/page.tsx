"use client";

import { useEffect, useState } from "react";
import { useNav } from "@/lib/nav-store";
import { HomePage } from "@/components/HomePage";
import { ServicesPage } from "@/components/ServicesPage";
import { ServicePanggilanPage } from "@/components/ServicePanggilanPage";
import { HowItWorksPage } from "@/components/HowItWorksPage";
import { OrderWizard } from "@/components/order/OrderWizard";
import { SuccessPage } from "@/components/order/SuccessPage";
import { PrivacyPage } from "@/components/PrivacyPage";
import { AdminPage } from "@/components/AdminPage";

export default function Home() {
  const { route } = useNav();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — render only after client mount
  // Zustand persist hydration requires client-only render
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050a17]">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 animate-pulse" />
      </div>
    );
  }

  // Router
  if (route.name === "home") return <HomePage />;
  if (route.name === "services") return <ServicesPage />;
  if (route.name === "service-panggilan") return <ServicePanggilanPage />;
  if (route.name === "how-it-works") return <HowItWorksPage />;
  if (route.name === "privacy") return <PrivacyPage />;
  if (route.name === "admin") return <AdminPage />;
  if (route.name === "order" && "orderNumber" in route) return <SuccessPage orderNumber={route.orderNumber} />;
  if (route.name === "order") return <OrderWizard />;

  // Default
  return <HomePage />;
}
