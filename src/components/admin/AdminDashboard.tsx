"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Cpu, LogOut, LayoutDashboard, ListTodo, Loader2, AlertCircle, ArrowLeft,
  Package, CheckCircle2, Clock, Wrench, XCircle, RefreshCw, Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNav } from "@/lib/nav-store";
import { ORDER_STATUS, ORDER_STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { OrderTable } from "./OrderTable";
import { OrderDetail } from "./OrderDetail";
import { toast } from "sonner";
import type { OrderRecord, ApiResponse } from "@/lib/types";

type View = "dashboard" | "orders" | "order-detail";

export function AdminDashboard() {
  const { navigate } = useNav();
  const [view, setView] = useState<View>("dashboard");
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [selected, setSelected] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/orders?limit=200");
      if (res.status === 401) {
        toast.error("Session expired, silakan login kembali");
        navigate({ name: "admin" });
        return;
      }
      const json: ApiResponse<OrderRecord[]> = await res.json();
      if (!json.success) throw new Error(json.error || "Gagal memuat orders");
      setOrders(json.data || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal memuat orders";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // ignore
    }
    toast.success("Berhasil logout");
    navigate({ name: "admin" });
    // Reload to clear client state
    if (typeof window !== "undefined") window.location.reload();
  };

  const handleSelect = (o: OrderRecord) => {
    setSelected(o);
    setView("order-detail");
  };

  const handleUpdated = (updated: OrderRecord) => {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    setSelected(updated);
  };

  // Stats
  const stats = {
    total: orders.length,
    new: orders.filter((o) => o.orderStatus === ORDER_STATUS.NEW).length,
    waitingConfirmation: orders.filter((o) => o.orderStatus === ORDER_STATUS.WAITING_CONFIRMATION).length,
    waitingShipment: orders.filter((o) => o.orderStatus === ORDER_STATUS.WAITING_SHIPMENT).length,
    inProgress: orders.filter((o) => o.orderStatus === ORDER_STATUS.IN_PROGRESS).length,
    completed: orders.filter((o) => o.orderStatus === ORDER_STATUS.COMPLETED).length,
    cancelled: orders.filter((o) => o.orderStatus === ORDER_STATUS.CANCELLED).length,
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050a17]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#050a17]/95 backdrop-blur-md border-b border-cyan-500/20">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate({ name: "home" })} className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center jarvis-glow">
                <Cpu className="w-5 h-5 text-[#050a17]" />
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-base font-bold text-white tracking-wider">
                  JARVIS<span className="text-cyan-400">.ID</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-cyan-300/70">Admin Dashboard</span>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Nav tabs */}
            <div className="hidden sm:flex items-center gap-1 mr-2">
              <NavTab active={view === "dashboard"} onClick={() => setView("dashboard")} icon={LayoutDashboard} label="Dashboard" />
              <NavTab active={view === "orders"} onClick={() => setView("orders")} icon={ListTodo} label="Orders" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-400"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>

        {/* Mobile nav tabs */}
        <div className="sm:hidden flex items-center border-t border-cyan-500/10">
          <NavTab active={view === "dashboard"} onClick={() => setView("dashboard")} icon={LayoutDashboard} label="Dashboard" mobile />
          <NavTab active={view === "orders"} onClick={() => setView("orders")} icon={ListTodo} label="Orders" mobile />
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 max-w-7xl py-6 sm:py-8">
        {view === "order-detail" && selected ? (
          <>
            {/* Mobile back button to orders list */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("orders")}
              className="sm:hidden mb-4 text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Orders
            </Button>
            <OrderDetail order={selected} onBack={() => setView("orders")} onUpdated={handleUpdated} />
          </>
        ) : view === "orders" ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl sm:text-2xl font-bold text-white">Order Service</h1>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchOrders}
                disabled={loading}
                className="bg-transparent border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10"
              >
                <RefreshCw className={cn("w-3.5 h-3.5 mr-2", loading && "animate-spin")} />
                Refresh
              </Button>
            </div>
            {loading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState error={error} onRetry={fetchOrders} />
            ) : (
              <OrderTable orders={orders} onSelect={handleSelect} />
            )}
          </div>
        ) : (
          // Dashboard view
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-xs text-slate-400 mt-0.5">Ringkasan order service JARVIS.ID</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchOrders}
                disabled={loading}
                className="bg-transparent border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10"
              >
                <RefreshCw className={cn("w-3.5 h-3.5 mr-2", loading && "animate-spin")} />
                Refresh
              </Button>
            </div>

            {loading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState error={error} onRetry={fetchOrders} />
            ) : (
              <>
                {/* Stat cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
                  <StatCard icon={Package} label="Total Order" value={stats.total} color="cyan" />
                  <StatCard icon={Clock} label="Order Baru" value={stats.new} color="blue" />
                  <StatCard icon={AlertCircle} label="Menunggu Konfirmasi" value={stats.waitingConfirmation} color="amber" />
                  <StatCard icon={Truck} label="Menunggu Pengiriman" value={stats.waitingShipment} color="purple" />
                  <StatCard icon={Wrench} label="Sedang Dikerjakan" value={stats.inProgress} color="yellow" />
                  <StatCard icon={CheckCircle2} label="Selesai" value={stats.completed} color="green" />
                  <StatCard icon={XCircle} label="Dibatalkan" value={stats.cancelled} color="red" />
                </div>

                {/* Recent orders */}
                <div className="rounded-2xl bg-[#0a1428]/60 border border-cyan-500/20 p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">Order Terbaru</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setView("orders")}
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      Lihat Semua →
                    </Button>
                  </div>
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-12 h-12 mx-auto text-slate-700 mb-3" />
                      <p className="text-sm text-slate-500">Belum ada order service.</p>
                      <p className="text-xs text-slate-600 mt-1">
                        Order yang masuk melalui form customer akan muncul di sini.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {orders.slice(0, 5).map((o) => (
                        <button
                          key={o.id}
                          onClick={() => handleSelect(o)}
                          className="w-full text-left p-3 rounded-lg bg-slate-900/40 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0 flex-grow">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-cyan-300 text-xs">{o.orderNumber}</span>
                              <span className={cn(
                                "text-[10px] px-1.5 py-0.5 rounded-full",
                                o.serviceArea === "ON_SITE"
                                  ? "bg-cyan-500/15 text-cyan-300"
                                  : "bg-amber-500/15 text-amber-300"
                              )}>
                                {o.serviceArea === "ON_SITE" ? "Panggilan" : "Kirim"}
                              </span>
                            </div>
                            <p className="text-sm text-white truncate">{o.customerName} • {o.deviceBrand} {o.deviceModel}</p>
                            <p className="text-[10px] text-slate-500">
                              {new Date(o.createdAt).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}
                            </p>
                          </div>
                          <div className="shrink-0 text-right">
                            <span className={cn(
                              "inline-block text-[10px] px-2 py-0.5 rounded-full font-medium",
                              ORDER_STATUS_COLORS[o.orderStatus] || "bg-slate-700 text-slate-300"
                            )}>
                              {ORDER_STATUS_LABELS[o.orderStatus]}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Admin quick links */}
                <div className="mt-6 grid sm:grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setView("orders")}
                    className="bg-transparent border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 h-16 justify-start"
                  >
                    <ListTodo className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <p className="text-sm font-semibold">Lihat Semua Orders</p>
                      <p className="text-xs text-slate-400">{stats.total} total</p>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate({ name: "home" })}
                    className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 h-16 justify-start"
                  >
                    <LayoutDashboard className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <p className="text-sm font-semibold">Lihat Website</p>
                      <p className="text-xs text-slate-400">Buka halaman publik</p>
                    </div>
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      <footer className="bg-[#050a17] border-t border-cyan-500/10 py-4 mt-auto">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} JARVIS.ID • Admin Dashboard</p>
        </div>
      </footer>
    </div>
  );
}

function NavTab({
  active, onClick, icon: Icon, label, mobile,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  mobile?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 text-sm font-medium transition-colors",
        mobile ? "flex-1 px-4 py-3 justify-center border-b-2" : "px-3 py-1.5 rounded-md",
        active
          ? mobile
            ? "text-cyan-400 border-cyan-400"
            : "text-cyan-400 bg-cyan-500/10"
          : mobile
          ? "text-slate-400 border-transparent hover:text-slate-200"
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function StatCard({
  icon: Icon, label, value, color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: "cyan" | "blue" | "amber" | "purple" | "yellow" | "green" | "red";
}) {
  const colors: Record<string, string> = {
    cyan: "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-400",
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400",
    amber: "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400",
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400",
    yellow: "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-400",
    green: "from-green-500/20 to-green-600/10 border-green-500/30 text-green-400",
    red: "from-red-500/20 to-red-600/10 border-red-500/30 text-red-400",
  };
  return (
    <div className={cn("p-4 rounded-2xl bg-gradient-to-br border", colors[color])}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-5 h-5" />
        <span className="text-2xl sm:text-3xl font-bold text-white">{value}</span>
      </div>
      <p className="text-xs text-slate-300 font-medium leading-tight">{label}</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
      <p className="text-sm text-slate-400">Memuat data...</p>
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <AlertCircle className="w-12 h-12 text-red-400 mb-3" />
      <p className="text-sm text-red-300 mb-4">{error}</p>
      <Button onClick={onRetry} variant="outline" className="bg-transparent border-cyan-500/40 text-cyan-300">
        <RefreshCw className="w-4 h-4 mr-2" />
        Coba Lagi
      </Button>
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

// Truck icon re-exported since we used it in stats
import { Truck } from "lucide-react";

// Lock icon re-exported for unused-import sanity (kept for parity with other admin files)
void Lock;
