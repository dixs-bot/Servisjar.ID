"use client";

import { Cpu, HardDrive, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOrderWizard } from "@/lib/order-wizard-store";
import { SOFTWARE_SERVICES, HARDWARE_SERVICES } from "@/lib/constants";

export function ServiceStep() {
  const { form, patch } = useOrderWizard();

  const toggleSoftware = (id: string) => {
    const arr = form.softwareServices.includes(id)
      ? form.softwareServices.filter((s) => s !== id)
      : [...form.softwareServices, id];
    patch({ softwareServices: arr });
  };

  const toggleHardware = (id: string) => {
    const arr = form.hardwareServices.includes(id)
      ? form.hardwareServices.filter((s) => s !== id)
      : [...form.hardwareServices, id];
    patch({ hardwareServices: arr });
  };

  const totalSelected = form.softwareServices.length + form.hardwareServices.length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Pilih Service</h2>
          <p className="text-sm text-slate-400">Boleh pilih lebih dari satu (multi-select).</p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-medium">
          {totalSelected} dipilih
        </span>
      </div>

      {/* Software */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Software Services</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {SOFTWARE_SERVICES.map((s) => {
            const checked = form.softwareServices.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleSoftware(s.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left transition-all",
                  checked
                    ? "bg-cyan-500/15 border-cyan-500 text-cyan-200"
                    : "bg-slate-900/40 border-slate-700 text-slate-300 hover:border-cyan-500/50"
                )}
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded border flex items-center justify-center shrink-0",
                    checked ? "bg-cyan-500 border-cyan-500" : "border-slate-600"
                  )}
                >
                  {checked && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-xs sm:text-sm">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hardware */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <HardDrive className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Hardware Services</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {HARDWARE_SERVICES.map((s) => {
            const checked = form.hardwareServices.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleHardware(s.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left transition-all",
                  checked
                    ? "bg-amber-500/15 border-amber-500 text-amber-200"
                    : "bg-slate-900/40 border-slate-700 text-slate-300 hover:border-amber-500/50"
                )}
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded border flex items-center justify-center shrink-0",
                    checked ? "bg-amber-500 border-amber-500" : "border-slate-600"
                  )}
                >
                  {checked && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-xs sm:text-sm">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {totalSelected === 0 && (
        <p className="text-xs text-amber-400 text-center py-2">
          Pilih minimal satu service untuk melanjutkan.
        </p>
      )}
    </div>
  );
}
