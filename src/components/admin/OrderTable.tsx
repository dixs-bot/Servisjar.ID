"use client";

import { useMemo, useState } from "react";
import { Search, Filter, ArrowRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORDER_STATUS, PAYMENT_STATUS, ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { OrderRecord } from "@/lib/types";

interface Props {
  orders: OrderRecord[];
  onSelect: (order: OrderRecord) => void;
}

export function OrderTable({ orders, onSelect }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [paymentFilter, setPaymentFilter] = useState<string>("ALL");

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== "ALL" && o.orderStatus !== statusFilter) return false;
      if (paymentFilter !== "ALL" && o.paymentStatus !== paymentFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.toLowerCase().includes(q) ||
          o.customerCity.toLowerCase().includes(q) ||
          o.deviceBrand.toLowerCase().includes(q) ||
          o.deviceModel.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [orders, search, statusFilter, paymentFilter]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nomor order, nama, telepon, device..."
            className="pl-10 bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 h-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="bg-slate-900/60 border-slate-700 text-white w-full sm:w-48 h-10">
            <Filter className="w-3.5 h-3.5 mr-2 text-slate-500" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700 text-white">
            <SelectItem value="ALL">Semua Status</SelectItem>
            {Object.entries(ORDER_STATUS).map(([k, v]) => (
              <SelectItem key={k} value={v} className="focus:bg-cyan-500/20">
                {ORDER_STATUS_LABELS[v]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="bg-slate-900/60 border-slate-700 text-white w-full sm:w-48 h-10">
            <Filter className="w-3.5 h-3.5 mr-2 text-slate-500" />
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700 text-white">
            <SelectItem value="ALL">Semua Payment</SelectItem>
            {Object.entries(PAYMENT_STATUS).map(([k, v]) => (
              <SelectItem key={k} value={v} className="focus:bg-cyan-500/20">
                {PAYMENT_STATUS_LABELS[v]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-xs text-slate-400">{filtered.length} order ditemukan</p>

      {/* Desktop table */}
      <div className="hidden lg:block overflow-hidden rounded-xl border border-slate-700">
        <table className="w-full text-sm">
          <thead className="bg-slate-900/80 text-slate-400">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Order</th>
              <th className="text-left px-4 py-3 font-medium">Customer</th>
              <th className="text-left px-4 py-3 font-medium">Device</th>
              <th className="text-left px-4 py-3 font-medium">Service</th>
              <th className="text-left px-4 py-3 font-medium">Area</th>
              <th className="text-left px-4 py-3 font-medium">Payment</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Date</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-12 text-slate-500 text-sm">
                  Belum ada order service.
                </td>
              </tr>
            ) : (
              filtered.map((o) => (
                <tr key={o.id} className="bg-slate-900/40 hover:bg-slate-900/60 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-cyan-300 text-xs">{o.orderNumber}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-white text-xs">{o.customerName}</div>
                    <div className="text-slate-500 text-[10px]">{o.customerPhone}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-white text-xs">{o.deviceBrand}</div>
                    <div className="text-slate-500 text-[10px]">{o.deviceModel}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-slate-300 text-xs">
                      {o.serviceType.length} layanan
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      o.serviceArea === "ON_SITE"
                        ? "bg-cyan-500/15 text-cyan-300"
                        : "bg-amber-500/15 text-amber-300"
                    )}>
                      {o.serviceArea === "ON_SITE" ? "Panggilan" : "Kirim"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <PaymentBadge status={o.paymentStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.orderStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-slate-400 text-[10px]">
                      {new Date(o.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onSelect(o)}
                      className="h-8 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      Detail
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm bg-slate-900/40 rounded-xl border border-slate-800">
            Belum ada order service.
          </div>
        ) : (
          filtered.map((o) => (
            <button
              key={o.id}
              onClick={() => onSelect(o)}
              className="w-full text-left p-4 rounded-xl bg-slate-900/60 border border-slate-700 hover:border-cyan-500/40 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="font-mono text-cyan-300 text-xs">{o.orderNumber}</span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </div>
              <div className="text-white text-sm font-semibold mb-1">{o.customerName}</div>
              <div className="text-slate-400 text-xs mb-3">
                {o.deviceBrand} {o.deviceModel} • {o.customerPhone}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={o.orderStatus} />
                <PaymentBadge status={o.paymentStatus} />
                <span className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full",
                  o.serviceArea === "ON_SITE"
                    ? "bg-cyan-500/15 text-cyan-300"
                    : "bg-amber-500/15 text-amber-300"
                )}>
                  {o.serviceArea === "ON_SITE" ? "Panggilan" : "Kirim"}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    NEW: "bg-blue-500/15 text-blue-300",
    WAITING_CONFIRMATION: "bg-amber-500/15 text-amber-300",
    CONFIRMED: "bg-cyan-500/15 text-cyan-300",
    WAITING_SHIPMENT: "bg-purple-500/15 text-purple-300",
    RECEIVED: "bg-indigo-500/15 text-indigo-300",
    IN_PROGRESS: "bg-yellow-500/15 text-yellow-300",
    COMPLETED: "bg-green-500/15 text-green-300",
    CANCELLED: "bg-red-500/15 text-red-300",
  };
  return (
    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", colors[status] || "bg-slate-700 text-slate-300")}>
      {ORDER_STATUS_LABELS[status] || status}
    </span>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    UNPAID: "bg-red-500/15 text-red-300",
    WAITING_CONFIRMATION: "bg-amber-500/15 text-amber-300",
    PAID: "bg-green-500/15 text-green-300",
    CANCELLED: "bg-slate-700 text-slate-400",
  };
  return (
    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", colors[status] || "bg-slate-700 text-slate-300")}>
      {PAYMENT_STATUS_LABELS[status] || status}
    </span>
  );
}
