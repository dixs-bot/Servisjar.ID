"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft, User, Smartphone, Wrench, MapPin, FileText, CreditCard,
  MessageCircle, Image as ImageIcon, Video, FileWarning, History, StickyNote,
  Loader2, Send, Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ORDER_STATUS, PAYMENT_STATUS, ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS, SOFTWARE_SERVICES, HARDWARE_SERVICES, BUSINESS } from "@/lib/constants";
import { openWhatsApp, createWhatsAppMessage } from "@/lib/whatsapp";
import type { OrderRecord, ApiResponse } from "@/lib/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  order: OrderRecord;
  onBack: () => void;
  onUpdated?: (order: OrderRecord) => void;
}

export function OrderDetail({ order, onBack, onUpdated }: Props) {
  const [updated, setUpdated] = useState<OrderRecord>(order);
  const [newStatus, setNewStatus] = useState<string>(order.orderStatus);
  const [newPayment, setNewPayment] = useState<string>(order.paymentStatus);
  const [statusNote, setStatusNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [noteType, setNoteType] = useState("GENERAL");
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    setUpdated(order);
    setNewStatus(order.orderStatus);
    setNewPayment(order.paymentStatus);
  }, [order]);

  const softwareLabels = updated.serviceType
    .map((id) => SOFTWARE_SERVICES.find((s) => s.id === id)?.label)
    .filter(Boolean);
  const hardwareLabels = updated.serviceType
    .map((id) => HARDWARE_SERVICES.find((s) => s.id === id)?.label)
    .filter(Boolean);

  const photos = updated.media.filter((m) => m.fileType === "DAMAGE_PHOTO");
  const videos = updated.media.filter((m) => m.fileType === "DAMAGE_VIDEO");
  const paymentProof = updated.media.filter((m) => m.fileType === "PAYMENT_PROOF");

  const saveStatus = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${updated.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderStatus: newStatus,
          paymentStatus: newPayment,
          note: statusNote || undefined,
        }),
      });
      const json: ApiResponse<OrderRecord> = await res.json();
      if (!json.success) throw new Error(json.error || "Gagal update status");
      setUpdated(json.data!);
      onUpdated?.(json.data!);
      setStatusNote("");
      toast.success("Status berhasil diupdate");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal update status");
    } finally {
      setSaving(false);
    }
  };

  const addNote = async () => {
    if (addingNote || !noteText.trim()) return;
    setAddingNote(true);
    try {
      const res = await fetch(`/api/admin/orders/${updated.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: noteText, noteType }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Gagal menambah note");
      // Refetch order to get updated notes
      const refetch = await fetch(`/api/admin/orders/${updated.id}`);
      const refetchJson: ApiResponse<OrderRecord> = await refetch.json();
      if (refetchJson.success && refetchJson.data) {
        setUpdated(refetchJson.data);
        onUpdated?.(refetchJson.data);
      }
      setNoteText("");
      toast.success("Note ditambahkan");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menambah note");
    } finally {
      setAddingNote(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white font-mono">{updated.orderNumber}</h2>
            <p className="text-xs text-slate-400">
              {new Date(updated.createdAt).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" })}
            </p>
          </div>
        </div>
        <Button
          onClick={() => openWhatsApp(createWhatsAppMessage(updated))}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          CHAT CUSTOMER
        </Button>
      </div>

      {/* Status & Payment cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        <InfoCard icon={Wrench} title="Order Status">
          <span className={cn(
            "inline-block text-xs px-2 py-1 rounded-full font-medium",
            ORDER_STATUS_COLORS[updated.orderStatus] || "bg-slate-700 text-slate-300"
          )}>
            {ORDER_STATUS_LABELS[updated.orderStatus]}
          </span>
        </InfoCard>
        <InfoCard icon={CreditCard} title="Payment Status">
          <span className={cn(
            "inline-block text-xs px-2 py-1 rounded-full font-medium",
            PAYMENT_STATUS_COLORS[updated.paymentStatus] || "bg-slate-700 text-slate-300"
          )}>
            {PAYMENT_STATUS_LABELS[updated.paymentStatus]} • {updated.paymentMethod}
          </span>
        </InfoCard>
      </div>

      {/* Customer */}
      <InfoSection icon={User} title="Customer">
        <Row label="Nama" value={updated.customerName} />
        <Row label="WhatsApp" value={updated.customerPhone} />
        {updated.customerEmail && <Row label="Email" value={updated.customerEmail} />}
        <Row label="Kota" value={updated.customerCity} />
        <Row label="Provinsi" value={updated.customerProvince} />
      </InfoSection>

      {/* Device */}
      <InfoSection icon={Smartphone} title="Device">
        <Row label="Brand" value={updated.deviceBrand} />
        <Row label="Model" value={updated.deviceModel} />
        {updated.imei && <Row label="IMEI" value={updated.imei} mono />}
        <Row label="Kondisi" value={updated.deviceCondition} />
      </InfoSection>

      {/* Service */}
      <InfoSection icon={Wrench} title="Service">
        <Row
          label="Layanan"
          value={[...softwareLabels, ...hardwareLabels].join(", ") || "-"}
        />
        {updated.serviceDetails && (
          <div className="mt-2">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Detail Kerusakan</p>
            <p className="text-sm text-slate-200 whitespace-pre-wrap bg-slate-900/40 p-3 rounded-lg">
              {updated.serviceDetails}
            </p>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
          {updated.previousRepair && <MiniRow label="Pernah dibuka" value={updated.previousRepair} />}
          {updated.rootStatus && <MiniRow label="Root" value={updated.rootStatus} />}
          {updated.customRomStatus && <MiniRow label="Custom ROM" value={updated.customRomStatus} />}
          {updated.waterExposure && <MiniRow label="Air" value={updated.waterExposure} />}
          {updated.droppedStatus && <MiniRow label="Jatuh" value={updated.droppedStatus} />}
        </div>
      </InfoSection>

      {/* Location / Shipping */}
      {updated.serviceArea === "ON_SITE" ? (
        <InfoSection icon={MapPin} title="Lokasi Service">
          {updated.serviceAddress && <Row label="Alamat" value={updated.serviceAddress} />}
          {updated.serviceLandmark && <Row label="Landmark" value={updated.serviceLandmark} />}
          {updated.latitude !== null && updated.longitude !== null && (
            <Row label="Koordinat" value={`${updated.latitude}, ${updated.longitude}`} mono />
          )}
          {updated.mapsUrl && (
            <a
              href={updated.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 mt-2"
            >
              <MapPin className="w-3 h-3" /> Buka Google Maps
            </a>
          )}
          {updated.preferredDate && <Row label="Tanggal Preferred" value={updated.preferredDate} />}
          {updated.preferredTime && <Row label="Jam Preferred" value={updated.preferredTime} />}
        </InfoSection>
      ) : (
        <InfoSection icon={Truck} title="Pengiriman Unit">
          {updated.shippingNotes && <Row label="Catatan" value={updated.shippingNotes} />}
          <div className="mt-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <p className="text-xs text-amber-200">
              Customer di luar Cimahi & Bandung. Konfirmasi via WhatsApp sebelum memberi instruksi pengiriman.
            </p>
            <div className="mt-2 text-xs text-slate-300 whitespace-pre-line">
              {BUSINESS.counter.fullText}
            </div>
          </div>
        </InfoSection>
      )}

      {/* Media */}
      <InfoSection icon={FileText} title={`Media (${photos.length + videos.length + paymentProof.length})`}>
        {photos.length === 0 && videos.length === 0 && paymentProof.length === 0 ? (
          <p className="text-sm text-slate-500">Belum ada foto/video.</p>
        ) : (
          <div className="space-y-4">
            {photos.length > 0 && (
              <div>
                <p className="text-xs text-cyan-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" /> Foto Kerusakan ({photos.length})
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {photos.map((m) => (
                    <a
                      key={m.id}
                      href={m.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-700 hover:border-cyan-500/50 transition-colors"
                    >
                      { }
                      <img src={m.fileUrl} alt={m.fileName} className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            )}
            {videos.length > 0 && (
              <div>
                <p className="text-xs text-blue-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Video className="w-3 h-3" /> Video ({videos.length})
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {videos.map((m) => (
                    <video
                      key={m.id}
                      src={m.fileUrl}
                      controls
                      className="w-full rounded-lg bg-slate-950 border border-slate-700"
                    />
                  ))}
                </div>
              </div>
            )}
            {paymentProof.length > 0 && (
              <div>
                <p className="text-xs text-green-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <FileWarning className="w-3 h-3" /> Bukti Bayar ({paymentProof.length})
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {paymentProof.map((m) => (
                    <a
                      key={m.id}
                      href={m.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-700 hover:border-green-500/50 flex items-center justify-center"
                    >
                      {m.mimeType === "application/pdf" ? (
                        <FileWarning className="w-8 h-8 text-red-400" />
                      ) : (
                         
                        <img src={m.fileUrl} alt={m.fileName} className="w-full h-full object-cover" />
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </InfoSection>

      {/* Status management */}
      <InfoSection icon={Wrench} title="Update Status">
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <div>
            <Label className="text-xs text-slate-400 mb-1 block">Order Status</Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger className="bg-slate-900/60 border-slate-700 text-white h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-white">
                {Object.entries(ORDER_STATUS).map(([k, v]) => (
                  <SelectItem key={k} value={v}>{ORDER_STATUS_LABELS[v]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-slate-400 mb-1 block">Payment Status</Label>
            <Select value={newPayment} onValueChange={setNewPayment}>
              <SelectTrigger className="bg-slate-900/60 border-slate-700 text-white h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-white">
                {Object.entries(PAYMENT_STATUS).map(([k, v]) => (
                  <SelectItem key={k} value={v}>{PAYMENT_STATUS_LABELS[v]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Textarea
          value={statusNote}
          onChange={(e) => setStatusNote(e.target.value)}
          placeholder="Catatan perubahan status (opsional)..."
          className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 min-h-[60px] mb-3"
          maxLength={1000}
        />
        <Button
          onClick={saveStatus}
          disabled={saving || (newStatus === updated.orderStatus && newPayment === updated.paymentStatus)}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white"
        >
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
          Update Status
        </Button>
      </InfoSection>

      {/* Notes */}
      <InfoSection icon={StickyNote} title={`Catatan (${updated.notes.length})`}>
        <div className="space-y-2 mb-3">
          <Textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Tambah catatan teknisi / inspection / estimate / payment / customer..."
            className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 min-h-[60px]"
            maxLength={2000}
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={noteType} onValueChange={setNoteType}>
              <SelectTrigger className="bg-slate-900/60 border-slate-700 text-white h-10 flex-grow">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-white">
                <SelectItem value="GENERAL">Umum</SelectItem>
                <SelectItem value="TECHNICIAN">Teknisi</SelectItem>
                <SelectItem value="INSPECTION">Inspeksi</SelectItem>
                <SelectItem value="ESTIMATE">Estimasi</SelectItem>
                <SelectItem value="PAYMENT">Pembayaran</SelectItem>
                <SelectItem value="CUSTOMER">Customer</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={addNote}
              disabled={addingNote || !noteText.trim()}
              className="bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30"
            >
              {addingNote ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              Tambah
            </Button>
          </div>
        </div>
        {updated.notes.length === 0 ? (
          <p className="text-sm text-slate-500">Belum ada catatan.</p>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto jarvis-scroll pr-1">
            {updated.notes.map((n) => (
              <div key={n.id} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 uppercase tracking-wider font-medium">
                    {n.noteType}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(n.createdAt).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}
                  </span>
                </div>
                <p className="text-sm text-slate-200 whitespace-pre-wrap">{n.note}</p>
              </div>
            ))}
          </div>
        )}
      </InfoSection>

      {/* Status history */}
      <InfoSection icon={History} title={`Riwayat Status (${updated.statusHistory.length})`}>
        {updated.statusHistory.length === 0 ? (
          <p className="text-sm text-slate-500">Belum ada riwayat.</p>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto jarvis-scroll pr-1">
            {updated.statusHistory.map((h) => (
              <div key={h.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/40 border border-slate-800">
                <div className="shrink-0 w-2 h-2 rounded-full bg-cyan-400 mt-1.5" />
                <div className="flex-grow">
                  <p className="text-sm text-slate-200">
                    {h.oldStatus ? ORDER_STATUS_LABELS[h.oldStatus] || h.oldStatus : "—"}
                    {" → "}
                    <span className="text-cyan-300 font-medium">{ORDER_STATUS_LABELS[h.newStatus] || h.newStatus}</span>
                  </p>
                  {h.note && <p className="text-xs text-slate-400 mt-0.5">{h.note}</p>}
                  <p className="text-[10px] text-slate-500 mt-1">
                    {new Date(h.createdAt).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </InfoSection>
    </div>
  );
}

const ORDER_STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-500/15 text-blue-300",
  WAITING_CONFIRMATION: "bg-amber-500/15 text-amber-300",
  CONFIRMED: "bg-cyan-500/15 text-cyan-300",
  WAITING_SHIPMENT: "bg-purple-500/15 text-purple-300",
  RECEIVED: "bg-indigo-500/15 text-indigo-300",
  IN_PROGRESS: "bg-yellow-500/15 text-yellow-300",
  COMPLETED: "bg-green-500/15 text-green-300",
  CANCELLED: "bg-red-500/15 text-red-300",
};

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  UNPAID: "bg-red-500/15 text-red-300",
  WAITING_CONFIRMATION: "bg-amber-500/15 text-amber-300",
  PAID: "bg-green-500/15 text-green-300",
  CANCELLED: "bg-slate-700 text-slate-400",
};

function InfoCard({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-cyan-400" />
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function InfoSection({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-4 text-sm py-1">
      <dt className="text-slate-500 text-xs uppercase tracking-wider shrink-0">{label}</dt>
      <dd className={cn("text-slate-200 sm:text-right break-words flex-grow", mono && "font-mono text-xs")}>{value}</dd>
    </div>
  );
}

function MiniRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2 rounded-lg bg-slate-900/40 border border-slate-800">
      <p className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</p>
      <p className="text-xs text-slate-200">{value}</p>
    </div>
  );
}
