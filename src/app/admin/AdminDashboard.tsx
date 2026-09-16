"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Guest } from "@/lib/types";
import StatsBar from "./components/StatsBar";
import GuestCard from "./components/GuestCard";
import GuestForm, { GuestFormValues } from "./components/GuestForm";
import ConfirmDialog from "./components/ConfirmDialog";

export default function AdminDashboard() {
  const router = useRouter();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [inviteBaseUrl] = useState(() =>
    typeof window !== "undefined" ? window.location.origin : ""
  );

  const [formOpen, setFormOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Guest | null>(null);
  const [resetTarget, setResetTarget] = useState<Guest | null>(null);

  const loadGuests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/guests");
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "تعذر تحميل قائمة الضيوف");
      setGuests(data.guests ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذر تحميل قائمة الضيوف");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    // Initial fetch on mount — loadGuests sets state inside an async
    // callback (after the fetch resolves), not synchronously in the effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadGuests();
  }, [loadGuests]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const filteredGuests = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return guests;
    return guests.filter(
      (g) => g.full_name.toLowerCase().includes(q) || g.phone.toLowerCase().includes(q)
    );
  }, [guests, search]);

  const stats = useMemo(
    () => ({
      total: guests.length,
      checkedIn: guests.filter((g) => g.checked_in).length,
    }),
    [guests]
  );

  async function handleCreateOrUpdate(values: GuestFormValues): Promise<string | null> {
    try {
      const isEdit = Boolean(editingGuest);
      const res = await fetch(isEdit ? `/api/guests/${editingGuest!.id}` : "/api/guests", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) return data.error || "حدث خطأ ما";

      setFormOpen(false);
      setEditingGuest(null);
      setToast(isEdit ? "تم تحديث بيانات الضيف" : "تمت إضافة الضيف");
      await loadGuests();
      return null;
    } catch {
      return "تعذر الاتصال بالخادم";
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setDeleteTarget(null);
    try {
      const res = await fetch(`/api/guests/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "تعذر حذف الضيف");
        return;
      }
      setToast("تم حذف الضيف");
      await loadGuests();
    } catch {
      setError("تعذر الاتصال بالخادم");
    }
  }

  async function handleResetCheckIn() {
    if (!resetTarget) return;
    const id = resetTarget.id;
    setResetTarget(null);
    try {
      const res = await fetch(`/api/guests/${id}/reset-checkin`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "تعذر إعادة تعيين الحضور");
        return;
      }
      setToast("تمت إعادة تعيين حالة الحضور");
      await loadGuests();
    } catch {
      setError("تعذر الاتصال بالخادم");
    }
  }

  async function handleCopyLink(guest: Guest) {
    const url = `${inviteBaseUrl}/invite/${guest.qr_token}`;
    try {
      await navigator.clipboard.writeText(url);
      setToast("تم نسخ الرابط");
    } catch {
      setError("تعذر نسخ الرابط");
    }
  }

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-10 border-b border-black/5 bg-cream/90 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <h1 className="font-serif text-xl text-emerald">لوحة تحكم الزفاف</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-foreground/50 underline underline-offset-4"
          >
            تسجيل الخروج
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-2xl space-y-5 px-4 pt-5">
        <StatsBar total={stats.total} checkedIn={stats.checkedIn} />

        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو رقم الجوال..."
            className="flex-1 rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald"
          />
          <button
            onClick={() => {
              setEditingGuest(null);
              setFormOpen(true);
            }}
            className="shrink-0 rounded-lg bg-emerald px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-dark"
          >
            + إضافة ضيف
          </button>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        {loading ? (
          <p className="py-10 text-center text-sm text-foreground/40">جاري التحميل...</p>
        ) : filteredGuests.length === 0 ? (
          <p className="py-10 text-center text-sm text-foreground/40">
            {guests.length === 0 ? "لا يوجد ضيوف بعد. ابدأ بإضافة ضيف." : "لا توجد نتائج مطابقة"}
          </p>
        ) : (
          <div className="space-y-3">
            {filteredGuests.map((guest) => (
              <GuestCard
                key={guest.id}
                guest={guest}
                inviteBaseUrl={inviteBaseUrl}
                onEdit={() => {
                  setEditingGuest(guest);
                  setFormOpen(true);
                }}
                onDelete={() => setDeleteTarget(guest)}
                onResetCheckIn={() => setResetTarget(guest)}
                onCopyLink={() => handleCopyLink(guest)}
              />
            ))}
          </div>
        )}
      </div>

      {formOpen && (
        <GuestForm
          guest={editingGuest}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => {
            setFormOpen(false);
            setEditingGuest(null);
          }}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="حذف الضيف"
        message={`هل أنت متأكد من حذف "${deleteTarget?.full_name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        open={Boolean(resetTarget)}
        title="إعادة تعيين الحضور"
        message={`هل تريد إعادة تعيين حالة حضور "${resetTarget?.full_name}" إلى غير محضّر؟`}
        confirmLabel="إعادة تعيين"
        onConfirm={handleResetCheckIn}
        onCancel={() => setResetTarget(null)}
      />

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-emerald-dark px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </main>
  );
}
