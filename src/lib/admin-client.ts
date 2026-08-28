// Client-side helper to read demo admin credentials (env-injected at build time).
// In production: never expose real admin credentials on the client.
// This is sandbox-only convenience for the demo login form.

export function getAdminCredentialsClient(): { email: string; password: string } | null {
  // Demo credentials are intentionally public in sandbox mode for ease of testing.
  // Override via ADMIN_EMAIL / ADMIN_PASSWORD env vars (server-side).
  const email = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@jarvis.id";
  const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "jarvis2026";
  return { email, password };
}
