// POST /api/admin/login

import { NextRequest, NextResponse } from "next/server";
import { adminLoginSchema } from "@/lib/validation";
import { getAdminCredentials, createSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = adminLoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Input tidak valid" },
        { status: 400 }
      );
    }
    const creds = getAdminCredentials();
    if (
      parsed.data.email.toLowerCase() !== creds.email.toLowerCase() ||
      parsed.data.password !== creds.password
    ) {
      return NextResponse.json(
        { success: false, error: "Email atau password salah" },
        { status: 401 }
      );
    }
    const headers = new Headers();
    headers.append("Set-Cookie", createSessionCookie(creds.email));
    return NextResponse.json(
      { success: true, data: { email: creds.email } },
      { status: 200, headers }
    );
  } catch (err) {
    console.error("[POST /api/admin/login] error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
