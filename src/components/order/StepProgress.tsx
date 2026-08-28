"use client";

import { useEffect } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOrderWizard } from "@/lib/order-wizard-store";
import { ON_SITE_STEPS, SEND_DEVICE_STEPS } from "@/lib/constants";

export function StepProgress() {
  const { step, form } = useOrderWizard();
  const steps = form.serviceArea === "ON_SITE" ? ON_SITE_STEPS : SEND_DEVICE_STEPS;

  return (
    <div className="w-full">
      {/* Mobile progress (compact) */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-cyan-300">
            Step {step} / {steps.length}
          </span>
          <span className="text-xs text-slate-400">
            {steps[step - 1]?.label}
          </span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
            style={{ width: `${(step / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop progress (full) */}
      <div className="hidden sm:flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((s, i) => {
          const isDone = step > s.id;
          const isCurrent = step === s.id;
          return (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                    isDone && "bg-cyan-500 border-cyan-500 text-white",
                    isCurrent && "bg-cyan-500/20 border-cyan-400 text-cyan-300 jarvis-glow",
                    !isDone && !isCurrent && "bg-slate-800/50 border-slate-700 text-slate-500"
                  )}
                >
                  {isDone ? <Check className="w-4 h-4" /> : s.id}
                </div>
                <span
                  className={cn(
                    "text-[10px] mt-1.5 font-medium uppercase tracking-wider text-center max-w-[80px]",
                    isCurrent ? "text-cyan-300" : isDone ? "text-slate-300" : "text-slate-500"
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 -mt-5 rounded-full transition-all",
                    isDone ? "bg-cyan-500" : "bg-slate-800"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
