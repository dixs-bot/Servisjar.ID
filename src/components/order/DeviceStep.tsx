"use client";

import { Smartphone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrderWizard } from "@/lib/order-wizard-store";
import { DEVICE_BRANDS, DEVICE_CONDITIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function DeviceStep() {
  const { form, patch } = useOrderWizard();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Data Device</h2>
        <p className="text-sm text-slate-400">Masukkan informasi perangkat Anda.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-cyan-300 text-xs font-medium">
            Brand <span className="text-red-400">*</span>
          </Label>
          <Select value={form.deviceBrand} onValueChange={(v) => patch({ deviceBrand: v })}>
            <SelectTrigger className="bg-slate-900/60 border-slate-700 text-white h-12 focus:border-cyan-500">
              <SelectValue placeholder="Pilih brand" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700 text-white max-h-72">
              {DEVICE_BRANDS.map((b) => (
                <SelectItem key={b} value={b} className="focus:bg-cyan-500/20 focus:text-cyan-300">
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="deviceModel" className="text-cyan-300 text-xs font-medium">
            Model <span className="text-red-400">*</span>
          </Label>
          <div className="relative">
            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              id="deviceModel"
              value={form.deviceModel}
              onChange={(e) => patch({ deviceModel: e.target.value })}
              placeholder="Contoh: Redmi Note 12 / Galaxy A54"
              className="pl-10 bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 h-12"
              maxLength={120}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="imei" className="text-cyan-300 text-xs font-medium">
            IMEI <span className="text-slate-500">(opsional)</span>
          </Label>
          <Input
            id="imei"
            value={form.imei}
            onChange={(e) => patch({ imei: e.target.value })}
            placeholder="15 digit IMEI (opsional)"
            className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 h-12 font-mono"
            maxLength={40}
            inputMode="numeric"
          />
          <p className="text-xs text-slate-500">Dial *#06# untuk mengecek IMEI.</p>
        </div>

        <div className="space-y-2">
          <Label className="text-cyan-300 text-xs font-medium">
            Kondisi Device <span className="text-red-400">*</span>
          </Label>
          <Select value={form.deviceCondition} onValueChange={(v) => patch({ deviceCondition: v })}>
            <SelectTrigger className="bg-slate-900/60 border-slate-700 text-white h-12 focus:border-cyan-500">
              <SelectValue placeholder="Pilih kondisi" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700 text-white max-h-72">
              {DEVICE_CONDITIONS.map((c) => (
                <SelectItem key={c} value={c} className="focus:bg-cyan-500/20 focus:text-cyan-300">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Brand quick-select chips */}
      <div>
        <p className="text-xs text-slate-500 mb-2">Brand populer:</p>
        <div className="flex flex-wrap gap-2">
          {["Samsung", "Xiaomi", "Redmi", "POCO", "OPPO", "Vivo", "Realme", "iPhone"].map((b) => (
            <Button
              key={b}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => patch({ deviceBrand: b })}
              className={cn(
                "h-8 px-3 text-xs",
                form.deviceBrand === b
                  ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                  : "bg-slate-900/40 border-slate-700 text-slate-300 hover:border-cyan-500/50"
              )}
            >
              {b}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
