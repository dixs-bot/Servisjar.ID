"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useOrderWizard } from "@/lib/order-wizard-store";
import { YES_NO_UNKNOWN, PREVIOUS_REPAIR_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { AlertTriangle, Wrench } from "lucide-react";

const YES_NO_QUESTIONS = [
  { key: "rootStatus", label: "Pernah di-root?" },
  { key: "customRomStatus", label: "Pernah pakai custom ROM?" },
  { key: "waterExposure", label: "Pernah terkena air?" },
  { key: "droppedStatus", label: "Pernah jatuh?" },
] as const;

export function DamageStep() {
  const { form, patch } = useOrderWizard();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Detail Kerusakan</h2>
        <p className="text-sm text-slate-400">Jelaskan kerusakan dan riwayat device.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="serviceDetails" className="text-cyan-300 text-xs font-medium">
          DETAIL KERUSAKAN / KEBUTUHAN SERVICE <span className="text-red-400">*</span>
        </Label>
        <Textarea
          id="serviceDetails"
          value={form.serviceDetails}
          onChange={(e) => patch({ serviceDetails: e.target.value })}
          placeholder="Jelaskan keluhan atau kebutuhan service HP Anda secara detail..."
          className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 min-h-[120px]"
          maxLength={2000}
        />
        <p className="text-xs text-slate-500">{form.serviceDetails.length}/2000 karakter</p>
      </div>

      {/* Previous repair */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Wrench className="w-4 h-4 text-cyan-400" />
          <p className="text-sm font-semibold text-white">
            Pernah dibuka / diperbaiki sebelumnya?
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PREVIOUS_REPAIR_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => patch({ previousRepair: opt })}
              className={cn(
                "px-3 py-2.5 rounded-lg border text-xs font-medium transition-all",
                form.previousRepair === opt
                  ? "bg-cyan-500/15 border-cyan-500 text-cyan-200"
                  : "bg-slate-900/40 border-slate-700 text-slate-300 hover:border-cyan-500/50"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Yes/No/Unknown questions */}
      <div className="space-y-3">
        {YES_NO_QUESTIONS.map((q) => (
          <div key={q.key}>
            <p className="text-sm font-semibold text-white mb-2">{q.label}</p>
            <div className="grid grid-cols-3 gap-2">
              {YES_NO_UNKNOWN.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => patch({ [q.key]: opt })}
                  className={cn(
                    "px-3 py-2.5 rounded-lg border text-xs font-medium transition-all",
                    form[q.key] === opt
                      ? opt === "Yes"
                        ? "bg-amber-500/15 border-amber-500 text-amber-200"
                        : opt === "No"
                        ? "bg-green-500/15 border-green-500 text-green-200"
                        : "bg-slate-500/15 border-slate-500 text-slate-200"
                      : "bg-slate-900/40 border-slate-700 text-slate-300 hover:border-cyan-500/50"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-200/80 leading-relaxed">
          Informasi yang akurat membantu teknisi menyiapkan part & tools yang tepat sebelum datang.
        </p>
      </div>
    </div>
  );
}
