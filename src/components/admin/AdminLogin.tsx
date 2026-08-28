"use client";

import { useState } from "react";
import { Lock, Mail, AlertCircle, Loader2, ArrowLeft, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNav } from "@/lib/nav-store";
import { toast } from "sonner";
import { getAdminCredentialsClient } from "@/lib/admin-client";

export function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const { navigate } = useNav();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || "Login gagal");
      }
      toast.success("Login berhasil");
      onLogin();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login gagal";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const creds = getAdminCredentialsClient();

  return (
    <div className="min-h-screen flex flex-col bg-[#050a17]">
      <header className="bg-[#050a17] border-b border-cyan-500/20">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl h-16 lg:h-20 flex items-center justify-between">
          <button onClick={() => navigate({ name: "home" })} className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center jarvis-glow">
              <Cpu className="w-5 h-5 text-[#050a17]" />
            </div>
            <span className="text-base font-bold text-white tracking-wider">
              JARVIS<span className="text-cyan-400">.ID</span>
            </span>
          </button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ name: "home" })}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="rounded-3xl bg-gradient-to-br from-[#0a1428] to-[#0c2461] border border-cyan-500/30 p-8 jarvis-glow">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center mb-4 jarvis-pulse">
                <Lock className="w-8 h-8 text-cyan-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">Admin Dashboard</h1>
              <p className="text-sm text-slate-400">Masuk untuk mengelola order service.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-cyan-300 text-xs font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@jarvis.id"
                    className="pl-10 bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 h-12"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-cyan-300 text-xs font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 h-12"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-red-200">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold h-12"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    MEMERIKSA...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    MASUK
                  </>
                )}
              </Button>
            </form>

            {creds && (
              <div className="mt-6 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                <p className="text-[10px] uppercase tracking-wider text-amber-400 mb-1">Demo Credentials</p>
                <p className="text-xs text-slate-300 font-mono">
                  Email: <span className="text-white">{creds.email}</span>
                </p>
                <p className="text-xs text-slate-300 font-mono">
                  Password: <span className="text-white">{creds.password}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-[#050a17] border-t border-cyan-500/10 py-4">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} JARVIS.ID • Admin Dashboard</p>
        </div>
      </footer>
    </div>
  );
}
