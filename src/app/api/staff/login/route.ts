import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSessionToken } from "@/lib/auth";
import { safeEqual } from "@/lib/password";

export async function POST(req: NextRequest) {
  const expected = process.env.STAFF_PASSCODE;
  const secret = process.env.SESSION_SECRET;

  if (!expected || !secret) {
    return NextResponse.json({ error: "الخادم غير مهيأ بشكل صحيح" }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  const passcode = typeof body?.passcode === "string" ? body.passcode : "";

  if (!passcode || !safeEqual(passcode, expected)) {
    return NextResponse.json({ error: "الرمز غير صحيح" }, { status: 401 });
  }

  const token = await createSessionToken("staff", secret);
  const store = await cookies();
  store.set("staff_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return NextResponse.json({ ok: true });
}
