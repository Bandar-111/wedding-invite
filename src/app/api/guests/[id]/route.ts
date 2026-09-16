import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  }

  const update: Record<string, unknown> = {};
  if (typeof body.full_name === "string") {
    const trimmed = body.full_name.trim();
    if (!trimmed) return NextResponse.json({ error: "الاسم مطلوب" }, { status: 400 });
    update.full_name = trimmed;
  }
  if (typeof body.phone === "string") {
    const trimmed = body.phone.trim();
    if (!trimmed) return NextResponse.json({ error: "رقم الجوال مطلوب" }, { status: 400 });
    update.phone = trimmed;
  }
  if (body.number_of_guests !== undefined) {
    update.number_of_guests = Math.max(1, Number(body.number_of_guests) || 1);
  }
  if (body.notes !== undefined) {
    update.notes = typeof body.notes === "string" ? body.notes.trim() || null : null;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "لا يوجد تغييرات" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("guests")
    .update(update)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ guest: data });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("guests").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
