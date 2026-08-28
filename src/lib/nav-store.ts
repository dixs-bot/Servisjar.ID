// Navigation store — single-page app router (sandbox only exposes / route)
// In production: replace with Next.js App Router navigation (multiple routes).

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Route =
  | { name: "home" }
  | { name: "services" }
  | { name: "service-panggilan" }
  | { name: "how-it-works" }
  | { name: "order" }
  | { name: "order"; orderNumber: string } // success page after submit
  | { name: "privacy" }
  | { name: "admin" };

interface NavState {
  route: Route;
  navigate: (route: Route) => void;
  // Order wizard initial service area
  initialServiceArea: "ON_SITE" | "SEND_DEVICE" | null;
  setInitialServiceArea: (a: "ON_SITE" | "SEND_DEVICE" | null) => void;
}

export const useNav = create<NavState>()(
  persist(
    (set) => ({
      route: { name: "home" },
      navigate: (route) => {
        set({ route });
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
        }
      },
      initialServiceArea: null,
      setInitialServiceArea: (a) => set({ initialServiceArea: a }),
    }),
    { name: "jarvis-nav" }
  )
);
