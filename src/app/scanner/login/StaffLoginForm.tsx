"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StaffLoginForm() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/staff/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "حدث خطأ ما");
        setLoading(false);
        return;
      }
      router.replace("/scanner");
      router.refresh();
    } catch {
      setError("تعذر الاتصال بالخادم");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="passcode" className="mb-1 block text-sm text-foreground/70">
          رمز الدخول
        </label>
        <input
          id="passcode"
          type="password"
          inputMode="numeric"
          autoFocus
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-base focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald"
          placeholder="••••"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading || !passcode}
        className="w-full rounded-lg bg-emerald px-4 py-2.5 font-medium text-white transition hover:bg-emerald-dark disabled:opacity-50"
      >
        {loading ? "جاري الدخول..." : "دخول"}
      </button>
    </form>
  );
}
