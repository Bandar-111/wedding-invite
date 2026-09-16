import { notFound } from "next/navigation";
import { headers } from "next/headers";
import QRCode from "qrcode";
import { getSupabaseAdmin } from "@/lib/supabase";
import { weddingConfig } from "@/lib/wedding-config";
import {
  BrushCorner,
  CalendarIcon,
  Divider,
  LocationIcon,
  PageBackground,
  QrIcon,
} from "./Ornaments";

export const dynamic = "force-dynamic";

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = getSupabaseAdmin();

  const { data: guest } = await supabase
    .from("guests")
    .select("full_name, number_of_guests, qr_token, short_code")
    .eq("qr_token", token)
    .maybeSingle();

  if (!guest) notFound();

  const baseUrl = await getBaseUrl();
  const inviteUrl = `${baseUrl}/invite/${guest.qr_token}`;
  const qrDataUrl = await QRCode.toDataURL(inviteUrl, {
    margin: 1,
    width: 320,
    color: { dark: "#123a2e", light: "#f8f2e2" },
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-night px-4 py-12 text-cream sm:py-16">
      <PageBackground className="pointer-events-none absolute inset-0 h-full w-full" />

      <BrushCorner
        seed={7}
        className="pointer-events-none absolute -left-6 -top-6 h-44 w-44 opacity-90 sm:h-56 sm:w-56"
      />
      <BrushCorner
        seed={13}
        className="pointer-events-none absolute -bottom-6 -right-6 h-44 w-44 rotate-180 opacity-90 sm:h-56 sm:w-56"
      />

      <div className="relative mx-auto flex w-full max-w-md flex-col items-center px-2 text-center">
        <p
          className="animate-fade-up text-xs uppercase tracking-[0.5em] text-gold/60"
          style={{ animationDelay: "0.05s" }}
        >
          بسم الله
        </p>

        <h1
          className="text-shimmer animate-fade-up mt-3 font-calligraphy text-6xl leading-none sm:text-7xl"
          style={{ animationDelay: "0.15s" }}
        >
          {weddingConfig.pageTitle}
        </h1>

        <Divider />

        <p
          className="animate-fade-up font-calligraphy text-xl leading-loose text-gold-light sm:text-2xl"
          style={{ animationDelay: "0.3s" }}
        >
          {weddingConfig.topBlessing}
        </p>

        <p
          className="animate-fade-up mt-6 text-sm leading-8 text-cream/75"
          style={{ animationDelay: "0.4s" }}
        >
          {weddingConfig.introLine}
        </p>

        <h2
          className="text-shimmer animate-fade-up mt-3 font-calligraphy text-5xl leading-tight sm:text-6xl"
          style={{ animationDelay: "0.5s" }}
        >
          {weddingConfig.eventTitle}
        </h2>

        <p
          className="animate-fade-up mt-4 text-sm leading-8 text-cream/75"
          style={{ animationDelay: "0.6s" }}
        >
          {weddingConfig.dinnerLine}
        </p>

        <Divider />

        <div
          className="animate-fade-up flex w-full items-stretch justify-center gap-6 sm:gap-10"
          style={{ animationDelay: "0.7s" }}
        >
          <div className="flex flex-1 flex-col items-center gap-2">
            <LocationIcon className="h-6 w-6 text-gold" />
            <span className="text-sm leading-6 text-cream/90">{weddingConfig.venueName}</span>
          </div>
          <span className="w-px shrink-0 bg-gold/30" />
          <div className="flex flex-1 flex-col items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-gold" />
            <span className="text-sm leading-6 text-cream/90">{weddingConfig.day}</span>
            <span className="text-sm leading-6 text-cream/90">{weddingConfig.date}</span>
          </div>
        </div>

        <Divider />

        <div className="animate-fade-up" style={{ animationDelay: "0.8s" }}>
          <p className="text-xs tracking-[0.4em] text-gold/60">{weddingConfig.hostLabel}</p>
          <p className="mt-2 font-serif text-xl text-gold-light sm:text-2xl">
            {weddingConfig.hostName}
          </p>
        </div>

        <div
          className="animate-fade-up mt-8 w-full rounded-2xl border border-gold/25 bg-cream/[0.04] px-5 py-4"
          style={{ animationDelay: "0.9s" }}
        >
          <p className="text-xs text-cream/50">(المكرمة)</p>
          <p className="mt-1 font-serif text-2xl text-gold-light">
            {guest.full_name}
          </p>
          {guest.number_of_guests > 1 && (
            <p className="mt-1 text-xs text-cream/50">عدد المدعوين: {guest.number_of_guests}</p>
          )}
        </div>

        <div
          className="animate-fade-up relative mx-auto mt-7 w-fit rounded-2xl border border-gold/40 bg-cream p-4"
          style={{ animationDelay: "1s" }}
        >
          <span className="absolute -right-1.5 -top-1.5 h-4 w-4 rounded-tr-lg border-r-2 border-t-2 border-gold" />
          <span className="absolute -left-1.5 -top-1.5 h-4 w-4 rounded-tl-lg border-l-2 border-t-2 border-gold" />
          <span className="absolute -bottom-1.5 -right-1.5 h-4 w-4 rounded-br-lg border-b-2 border-r-2 border-gold" />
          <span className="absolute -bottom-1.5 -left-1.5 h-4 w-4 rounded-bl-lg border-b-2 border-l-2 border-gold" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrDataUrl}
            alt="رمز الدخول الخاص بالدعوة"
            className="h-40 w-40 sm:h-48 sm:w-48"
          />
        </div>

        <div className="animate-fade-up mt-4" style={{ animationDelay: "1.05s" }}>
          <p className="text-xs text-cream/50">أو الرمز المختصر</p>
          <p className="mt-1 font-serif text-2xl tracking-[0.4em] text-gold-light">
            {guest.short_code}
          </p>
        </div>

        <p
          className="animate-fade-up mt-8 font-calligraphy text-lg leading-loose text-gold-light sm:text-xl"
          style={{ animationDelay: "1.15s" }}
        >
          {weddingConfig.closingLine}
        </p>

        <div
          className="animate-fade-up mt-7 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "1.25s" }}
        >
          {weddingConfig.venueMapUrl && (
            <a
              href={weddingConfig.venueMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-xs font-medium text-gold-light transition hover:bg-gold/20"
            >
              <LocationIcon className="h-3.5 w-3.5" />
              عرض الموقع على الخريطة
            </a>
          )}
          <a
            href={qrDataUrl}
            download={`invite-${guest.short_code}.png`}
            className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-xs font-medium text-gold-light transition hover:bg-gold/20"
          >
            <QrIcon className="h-3.5 w-3.5" />
            تحميل الباركود
          </a>
        </div>

        <p className="animate-fade-up mt-6 text-xs text-cream/40" style={{ animationDelay: "1.3s" }}>
          يرجى إحضار هذه الدعوة (رمز QR أو الرمز المختصر) عند الحضور
        </p>
      </div>
    </main>
  );
}
