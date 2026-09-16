import { NextRequest, NextResponse } from "next/server";
import { requireStaffOrAdmin } from "@/lib/session";
import { getSupabaseAdmin } from "@/lib/supabase";

// Accepts either a bare token or a full invitation URL (the QR code encodes
// the URL so any generic QR reader also works) and pulls out the token.
function extractToken(raw: string): string {
  try {
    const url = new URL(raw);
    const parts = url.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] || raw;
  } catch {
    return raw;
  }
}

export async function POST(req: NextRequest) {
  if (!(await requireStaffOrAdmin())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const raw = typeof body?.token === "string" ? body.token.trim() : "";

  if (!raw) {
    return NextResponse.json({ status: "invalid" });
  }

  const token = extractToken(raw);
  const supabase = getSupabaseAdmin();

  // Atomic RPC: row-locks the guest so two scanners hitting the same QR
  // at the same instant can't both succeed.
  const { data, error } = await supabase.rpc("check_in_guest", { p_token: token });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const row = Array.isArray(data) ? data[0] : null;

  if (!row || row.result === "invalid") {
    return NextResponse.json({ status: "invalid" });
  }

  return NextResponse.json({
    status: row.result as "success" | "already_used",
    guest: {
      full_name: row.full_name,
      number_of_guests: row.number_of_guests,
      checked_in_at: row.checked_in_at,
    },
  });
}
