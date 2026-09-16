"use client";

import { useState } from "react";
import type { Guest } from "@/lib/types";

export interface GuestFormValues {
  full_name: string;
  phone: string;
  number_of_guests: number;
  notes: string;
}

interface GuestFormProps {
  guest?: Guest | null;
  onSubmit: (values: GuestFormValues) => Promise<string | null>; // returns error message or null
  onCancel: () => void;
}

export default function GuestForm({ guest, onSubmit, onCancel }: GuestFormProps) {
  const [fullName, setFullName] = useState(guest?.full_name ?? "");
  const [phone, setPhone] = useState(guest?.phone ?? "");
  const [numberOfGuests, setNumberOfGuests] = useState(guest?.number_of_guests ?? 1);
  const [notes, setNotes] = useState(guest?.notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await onSubmit({
      full_name: fullName,
      phone,
      number_of_guests: numberOfGuests,
      notes,
    });

    if (result) {
      setError(result);
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl"
      >
        <h2 className="mb-5 font-serif text-lg text-emerald">
          {guest ? "تعديل بيانات الضيف" : "إضافة ضيف جديد"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-foreground/70">الاسم الكامل</label>
            <input
              autoFocus
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-base focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald"
              placeholder="مثال: محمد العتيبي"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-foreground/70">رقم الجوال</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              dir="ltr"
              className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-base text-right focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald"
              placeholder="05xxxxxxxx"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-foreground/70">عدد المدعوين</label>
            <input
              type="number"
              min={1}
              value={numberOfGuests}
              onChange={(e) => setNumberOfGuests(Math.max(1, Number(e.target.value) || 1))}
              className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-base focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-foreground/70">ملاحظات (اختياري)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-base focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald"
              placeholder="مثال: صديق العائلة"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg border border-black/10 py-2.5 text-sm font-medium text-foreground/70 transition hover:bg-black/5"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={loading || !fullName.trim() || !phone.trim()}
            className="flex-1 rounded-lg bg-emerald py-2.5 text-sm font-medium text-white transition hover:bg-emerald-dark disabled:opacity-50"
          >
            {loading ? "جاري الحفظ..." : "حفظ"}
          </button>
        </div>
      </form>
    </div>
  );
}
