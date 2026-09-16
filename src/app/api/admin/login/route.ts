import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSessionToken } from "@/lib/auth";
import { safeEqual } from "@/lib/password";

export async function POST(req: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD;
  const secret = process.env.SESSION_SECRET;

  if (!expected || !secret) {
    return NextResponse.json({ error: "الخادم غير مهيأ بشكل صحيح" }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!password || !safeEqual(password, expected)) {
    return NextResponse.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 });
  }

  const token = await createSessionToken("admin", secret);
  const store = await cookies();
  store.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return NextResponse.json({ ok: true });
}
