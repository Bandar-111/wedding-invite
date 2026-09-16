"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";

const SCANNER_ELEMENT_ID = "qr-reader";
const RESUME_DELAY_MS = 3000;

type CheckinStatus = "success" | "already_used" | "invalid";

interface CheckinGuest {
  full_name: string;
  number_of_guests: number;
  checked_in_at: string | null;
}

interface ScanResult {
  status: CheckinStatus;
  guest?: CheckinGuest;
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("ar-SA", { dateStyle: "medium", timeStyle: "short" });
}

export default function ScannerPage() {
  const router = useRouter();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const processingRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedRef = useRef(false);

  const [cameraError, setCameraError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [manualCode, setManualCode] = useState("");

  const resume = useCallback(() => {
    setResult(null);
    processingRef.current = false;
    try {
      scannerRef.current?.resume();
    } catch {
      // scanner may not be in a paused state; ignore
    }
  }, []);

  const handleScan = useCallback(
    async (decodedText: string) => {
      if (processingRef.current) return;
      processingRef.current = true;

      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = null;
      }

      try {
        scannerRef.current?.pause(true);
      } catch {
        // ignore
      }

      try {
        const res = await fetch("/api/checkin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: decodedText }),
        });

        if (res.status === 401) {
          router.replace("/scanner/login");
          return;
        }

        const data = await res.json();
        if (data.status === "success" || data.status === "already_used") {
          setResult({ status: data.status, guest: data.guest });
        } else {
          setResult({ status: "invalid" });
        }
      } catch {
        setResult({ status: "invalid" });
      }

      resumeTimerRef.current = setTimeout(resume, RESUME_DELAY_MS);
    },
    [resume, router]
  );

  useEffect(() => {
    const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          void handleScan(decodedText);
        },
        () => {
          // per-frame decode errors are expected while no code is in view
        }
      )
      .then(() => {
        startedRef.current = true;
      })
      .catch(() => {
        setCameraError("تعذر تشغيل الكاميرا. تأكد من منح إذن الكاميرا لهذا المتصفح.");
      });

    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      if (!startedRef.current) return;
      try {
        scanner
          .stop()
          .then(() => scanner.clear())
          .catch(() => {});
      } catch {
        // scanner was never fully started; nothing to stop
      }
    };
  }, [handleScan]);

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = manualCode.trim();
    if (!code) return;
    setManualCode("");
    void handleScan(code);
  }

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.replace("/scanner/login");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen flex-col bg-emerald-dark text-white">
      <header className="flex items-center justify-between px-4 py-4">
        <h1 className="font-serif text-lg">مسح دعوات الزفاف</h1>
        <button onClick={handleLogout} className="text-sm text-white/60 underline underline-offset-4">
          تسجيل الخروج
        </button>
      </header>

      <div className="mx-auto w-full max-w-md flex-1 px-4 pb-6">
        <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="mb-2 text-center text-sm text-white/60">أو أدخل الرمز يدويًا</p>
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="مثال: K7P2XQ"
              className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-center text-base tracking-[0.3em] text-white placeholder:tracking-normal placeholder:text-white/30 focus:border-gold focus:outline-none"
            />
            <button
              type="submit"
              disabled={!manualCode.trim()}
              className="shrink-0 rounded-lg bg-gold px-4 py-2.5 text-sm font-medium text-emerald-dark transition hover:bg-gold-light disabled:opacity-40"
            >
              تأكيد
            </button>
          </form>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
          <div id={SCANNER_ELEMENT_ID} className="w-full" />
        </div>

        {cameraError && (
          <p className="mt-4 rounded-lg bg-red-500/20 px-3 py-2 text-center text-sm text-red-200">
            {cameraError}
          </p>
        )}

        {!cameraError && !result && (
          <p className="mt-4 text-center text-sm text-white/50">
            وجّه الكاميرا نحو رمز QR الخاص بالدعوة
          </p>
        )}
      </div>

      {result && (
        <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-6">
          <div
            className={`mx-auto max-w-md rounded-2xl p-5 text-center shadow-xl ${
              result.status === "success"
                ? "bg-green-600"
                : result.status === "already_used"
                ? "bg-amber-500"
                : "bg-red-600"
            }`}
          >
            {result.status === "success" && (
              <>
                <p className="text-2xl">✅</p>
                <p className="mt-1 text-lg font-bold">تم تسجيل الحضور بنجاح</p>
                <p className="mt-1 font-serif text-xl">{result.guest?.full_name}</p>
                <p className="mt-1 text-sm text-white/80">
                  عدد المدعوين: {result.guest?.number_of_guests}
                </p>
              </>
            )}

            {result.status === "already_used" && (
              <>
                <p className="text-2xl">⚠️</p>
                <p className="mt-1 text-lg font-bold">تم استخدام هذه الدعوة مسبقًا</p>
                <p className="mt-1 font-serif text-xl">{result.guest?.full_name}</p>
                {result.guest?.checked_in_at && (
                  <p className="mt-1 text-sm text-white/80">
                    وقت الحضور: {formatDateTime(result.guest.checked_in_at)}
                  </p>
                )}
              </>
            )}

            {result.status === "invalid" && (
              <>
                <p className="text-2xl">❌</p>
                <p className="mt-1 text-lg font-bold">دعوة غير صالحة</p>
              </>
            )}

            <button
              onClick={() => {
                if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
                resume();
              }}
              className="mt-4 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium transition hover:bg-white/30"
            >
              متابعة المسح
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
