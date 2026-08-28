// JARVIS.ID — simple admin session (sandbox demo)
//
// Sandbox demo uses a hardcoded admin credential from env (ADMIN_EMAIL / ADMIN_PASSWORD)
// with a signed cookie. Production uses Supabase Auth (see README).

import crypto from "crypto";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@jarvis.id";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "jarvis2026";
const SESSION_SECRET = process.env.SESSION_SECRET || "jarvis-id-dev-session-secret-change-me";
const SESSION_COOKIE = "jarvis_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

export function getAdminCredentials() {
  return { email: ADMIN_EMAIL, password: ADMIN_PASSWORD };
}

export function signSession(payload: { email: string; exp: number }): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SESSION_SECRET).update(body).digest("hex");
  return `${body}.${sig}`;
}

export function verifySession(token: string | undefined | null): { email: string; exp: number } | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = crypto.createHmac("sha256", SESSION_SECRET).update(body).digest("hex");
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function createSessionCookie(email: string): string {
  const token = signSession({ email, exp: Date.now() + SESSION_TTL_MS });
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_MS / 1000}`;
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
