"use client";

import { useRef, useState } from "react";
import { Banknote, CreditCard, UploadCloud, X, FileWarning, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useOrderWizard, makeUploadedFile } from "@/lib/order-wizard-store";
import { FILE_LIMITS, BUSINESS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function PaymentStep() {
  const { form, patch } = useOrderWizard();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const limit = FILE_LIMITS.PAYMENT;
  const hasBankInfo = BUSINESS.bank.name && BUSINESS.bank.accountName && BUSINESS.bank.accountNumber;

  const setMethod = (method: "CASH" | "TRANSFER") => {
    patch({ paymentMethod: method });
    if (method !== "TRANSFER") {
      // Clear payment proof if not transfer
      form.paymentProof.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
      patch({ paymentProof: [] });
    }
  };

  const handleFiles = (incoming: FileList) => {
    setError(null);
    const arr = Array.from(incoming);
    if (form.paymentProof.length + arr.length > limit.maxCount) {
      setError(`Maksimal ${limit.maxCount} file bukti bayar.`);
      return;
    }
    const toAdd = [];
    for (const f of arr) {
      if (!limit.mime.includes(f.type)) {
        setError(`${f.name}: tipe tidak didukung. Allowed: ${limit.ext.join(", ")}`);
        continue;
      }
      if (f.size > limit.maxBytes) {
        const mb = Math.round((limit.maxBytes / 1024 / 1024) * 10) / 10;
        setError(`${f.name}: melebihi ${mb} MB`);
        continue;
      }
      toAdd.push(makeUploadedFile(f));
    }
    if (toAdd.length > 0) patch({ paymentProof: [...form.paymentProof, ...toAdd] });
  };

  const removeProof = (idx: number) => {
    if (form.paymentProof[idx].preview) URL.revokeObjectURL(form.paymentProof[idx].preview!);
    patch({ paymentProof: form.paymentProof.filter((_, i) => i !== idx) });
  };

  const copyBank = () => {
    if (!hasBankInfo) return;
    const text = `${BUSINESS.bank.name}\n${BUSINESS.bank.accountName}\n${BUSINESS.bank.accountNumber}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Metode Pembayaran</h2>
        <p className="text-sm text-slate-400">Pilih metode pembayaran yang diinginkan.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setMethod("CASH")}
          className={cn(
            "p-5 rounded-2xl border-2 text-left transition-all",
            form.paymentMethod === "CASH"
              ? "bg-cyan-500/10 border-cyan-500"
              : "bg-slate-900/40 border-slate-700 hover:border-cyan-500/50"
          )}
        >
          <Banknote className={cn("w-7 h-7 mb-3", form.paymentMethod === "CASH" ? "text-cyan-400" : "text-slate-500")} />
          <p className="text-base font-bold text-white">CASH</p>
          <p className="text-xs text-slate-400 mt-1">Bayar tunai saat teknisi datang / di counter</p>
        </button>

        <button
          type="button"
          onClick={() => setMethod("TRANSFER")}
          className={cn(
            "p-5 rounded-2xl border-2 text-left transition-all",
            form.paymentMethod === "TRANSFER"
              ? "bg-cyan-500/10 border-cyan-500"
              : "bg-slate-900/40 border-slate-700 hover:border-cyan-500/50"
          )}
        >
          <CreditCard className={cn("w-7 h-7 mb-3", form.paymentMethod === "TRANSFER" ? "text-cyan-400" : "text-slate-500")} />
          <p className="text-base font-bold text-white">TRANSFER</p>
          <p className="text-xs text-slate-400 mt-1">Transfer bank + upload bukti</p>
        </button>
      </div>

      {form.paymentMethod === "TRANSFER" && (
        <div className="space-y-4">
          {/* Bank info */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-white uppercase tracking-wider">Informasi Rekening</p>
              {hasBankInfo && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={copyBank}
                  className="h-7 text-xs bg-transparent border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10"
                >
                  {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                  {copied ? "Tersalin" : "Salin"}
                </Button>
              )}
            </div>
            {hasBankInfo ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Bank</span>
                  <span className="text-white font-medium">{BUSINESS.bank.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Atas Nama</span>
                  <span className="text-white font-medium">{BUSINESS.bank.accountName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">No. Rekening</span>
                  <span className="text-white font-mono font-bold">{BUSINESS.bank.accountNumber}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-amber-300">
                Detail rekening akan diberikan admin melalui WhatsApp.
              </p>
            )}
          </div>

          {/* Upload proof */}
          <div>
            <Label className="text-cyan-300 text-xs font-medium mb-2 block">
              UPLOAD BUKTI TRANSFER
            </Label>
            <div
              onClick={() => inputRef.current?.click()}
              className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/40 hover:border-cyan-500/50 hover:bg-slate-900/60 p-6 text-center transition-all"
            >
              <input
                ref={inputRef}
                type="file"
                accept={limit.mime.join(",")}
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
                className="sr-only"
              />
              <UploadCloud className="w-10 h-10 mx-auto text-cyan-400 mb-2" />
              <p className="text-sm font-semibold text-white">Upload Bukti Transfer</p>
              <p className="text-xs text-slate-400 mt-1">
                JPG, PNG, WEBP, atau PDF. Maks {Math.round((limit.maxBytes / 1024 / 1024) * 10) / 10} MB.
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 mt-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <FileWarning className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <p className="text-xs text-red-200">{error}</p>
              </div>
            )}

            {form.paymentProof.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                {form.paymentProof.map((f, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden bg-slate-900/60 border border-slate-700">
                    <div className="aspect-video bg-slate-950 flex items-center justify-center">
                      {f.preview ? (
                        f.file.type === "application/pdf" ? (
                          <FileWarning className="w-8 h-8 text-red-400" />
                        ) : (
                           
                          <img src={f.preview} alt={f.file.name} className="w-full h-full object-cover" />
                        )
                      ) : (
                        <FileWarning className="w-8 h-8 text-slate-600" />
                      )}
                    </div>
                    <div className="p-2">
                      <p className="text-xs text-slate-300 truncate">{f.file.name}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProof(i)}
                      className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-red-500/90 hover:bg-red-500 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Hapus bukti"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <FileWarning className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-200/80 leading-relaxed">
              Pembayaran transfer tetap berstatus "Menunggu Verifikasi" sampai admin JARVIS.ID
              memverifikasi bukti pembayaran Anda.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
