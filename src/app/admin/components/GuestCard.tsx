"use client";

import type { Guest } from "@/lib/types";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { buildWhatsAppMessage } from "@/lib/wedding-config";

interface GuestCardProps {
  guest: Guest;
  inviteBaseUrl: string;
  onEdit: () => void;
  onDelete: () => void;
  onResetCheckIn: () => void;
  onCopyLink: () => void;
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("ar-SA", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function GuestCard({
  guest,
  inviteBaseUrl,
  onEdit,
  onDelete,
  onResetCheckIn,
  onCopyLink,
}: GuestCardProps) {
  const inviteUrl = `${inviteBaseUrl}/invite/${guest.qr_token}`;
  const whatsappUrl = buildWhatsAppUrl(guest.phone, buildWhatsAppMessage(inviteUrl));

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-medium text-foreground">{guest.full_name}</p>
          <p dir="ltr" className="mt-0.5 text-left text-sm text-foreground/50">
            {guest.phone}
          </p>
        </div>
        {guest.checked_in ? (
          <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
            تم الحضور
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-black/5 px-2.5 py-1 text-xs font-medium text-foreground/50">
            لم يحضر
          </span>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-foreground/50">
        <span>عدد المدعوين: {guest.number_of_guests}</span>
        {guest.checked_in && guest.checked_in_at && (
          <span>وقت الحضور: {formatDateTime(guest.checked_in_at)}</span>
        )}
      </div>

      {guest.notes && (
        <p className="mt-2 rounded-lg bg-black/[0.03] px-2.5 py-1.5 text-xs text-foreground/60">
          {guest.notes}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={onCopyLink}
          className="rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium text-foreground/70 transition hover:bg-black/5"
        >
          نسخ الرابط
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
        >
          مشاركة عبر واتساب
        </a>
        <button
          onClick={onEdit}
          className="rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium text-foreground/70 transition hover:bg-black/5"
        >
          تعديل
        </button>
        {guest.checked_in && (
          <button
            onClick={onResetCheckIn}
            className="rounded-lg border border-gold/40 px-3 py-1.5 text-xs font-medium text-gold transition hover:bg-gold/10"
          >
            إعادة تعيين الحضور
          </button>
        )}
        <button
          onClick={onDelete}
          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
        >
          حذف
        </button>
      </div>
    </div>
  );
}
