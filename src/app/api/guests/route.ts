import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { getSupabaseAdmin } from "@/lib/supabase";

// Guest lists for a single wedding are small, so the admin dashboard fetches
// everything once and searches/filters on the client. No pagination needed.

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ guests: data });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const fullName = typeof body?.full_name === "string" ? body.full_name.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";

  if (!fullName) {
    return NextResponse.json({ error: "الاسم مطلوب" }, { status: 400 });
  }
  if (!phone) {
    return NextResponse.json({ error: "رقم الجوال مطلوب" }, { status: 400 });
  }

  const numberOfGuests = Math.max(1, Number(body?.number_of_guests) || 1);
  const notes = typeof body?.notes === "string" ? body.notes.trim() || null : null;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("guests")
    .insert({ full_name: fullName, phone, number_of_guests: numberOfGuests, notes })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ guest: data }, { status: 201 });
}
