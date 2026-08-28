// POST /api/admin/logout

import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  const headers = new Headers();
  headers.append("Set-Cookie", clearSessionCookie());
  return NextResponse.json({ success: true }, { status: 200, headers });
}
