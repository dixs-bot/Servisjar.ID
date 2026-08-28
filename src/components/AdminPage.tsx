"use client";

import { useEffect, useState } from "react";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { Loader2 } from "lucide-react";

export function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    // Check existing session
    (async () => {
      try {
        const res = await fetch("/api/admin/orders?limit=1");
        setAuthed(res.status !== 401);
      } catch {
        setAuthed(false);
      }
    })();
  }, []);

  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050a17]">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return authed ? <AdminDashboard /> : <AdminLogin onLogin={() => setAuthed(true)} />;
}
