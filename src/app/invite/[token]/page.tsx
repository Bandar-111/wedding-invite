import { notFound } from "next/navigation";
import { headers } from "next/headers";
import QRCode from "qrcode";
import { getSupabaseAdmin } from "@/lib/supabase";
import { weddingConfig } from "@/lib/wedding-config";
import FloralCorner from "./FloralCorner";

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
    color: { dark: "#123a2e", light: "#faf7f0" },
  });

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fffdf8,_#f3ecdc)] px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-md">
        <div className="relative overflow-hidden rounded-[28px] border border-gold/40 bg-cream shadow-[0_10px_40px_rgba(18,58,46,0.12)]">
          {/* Corner ornaments */}
          <div className="pointer-events-none absolute inset-3 rounded-3xl border border-gold/30" />

          <FloralCorner className="pointer-events-none absolute right-0 top-0 h-20 w-20 sm:h-24 sm:w-24" />
          <FloralCorner className="pointer-events-none absolute left-0 top-0 h-20 w-20 -scale-x-100 sm:h-24 sm:w-24" />
          <FloralCorner className="pointer-events-none absolute bottom-0 left-0 h-20 w-20 rotate-180 sm:h-24 sm:w-24" />
          <FloralCorner className="pointer-events-none absolute bottom-0 right-0 h-20 w-20 -scale-x-100 rotate-180 sm:h-24 sm:w-24" />

          <div className="relative px-7 py-10 text-center sm:px-10 sm:py-12">
            <p className="font-serif text-sm leading-7 tracking-wide text-gold">
              {weddingConfig.topBlessing}
            </p>

            <div className="mx-auto my-6 h-px w-16 bg-gold-light" />

            <p className="text-sm leading-7 text-foreground/70">{weddingConfig.introText}</p>

            <p className="mt-5 text-sm leading-7 text-foreground/70">
              {weddingConfig.hostingTitle}
              <br />
              <span className="font-serif text-lg text-emerald">{weddingConfig.hostingName}</span>
              <br />
              {weddingConfig.invitationLine}
            </p>

            <h1 className="my-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-serif text-lg leading-tight text-emerald sm:text-2xl">
              <span>{weddingConfig.groomName}</span>
              <span className="text-base sm:text-xl" aria-hidden="true">
                💍
              </span>
              <span>{weddingConfig.brideName}</span>
            </h1>

            <div className="mx-auto my-6 h-px w-16 bg-gold-light" />

            <div className="mb-6 rounded-2xl bg-emerald/5 px-5 py-4">
              <p className="text-sm text-foreground/60">(المكرم/ـة)</p>
              <p className="mt-1 font-serif text-2xl text-emerald">{guest.full_name}</p>
              {guest.number_of_guests > 1 && (
                <p className="mt-1 text-xs text-foreground/50">
                  عدد المدعوين: {guest.number_of_guests}
                </p>
              )}
            </div>

            <dl className="mb-6 space-y-3 text-sm">
              <div className="flex items-center justify-between border-b border-black/5 pb-3">
                <dt className="text-foreground/50">التاريخ</dt>
                <dd className="font-medium text-foreground">
                  {weddingConfig.day}
                  <span className="text-foreground/50"> — </span>
                  {weddingConfig.date}
                </dd>
              </div>
              <div className="flex items-center justify-between border-b border-black/5 pb-3">
                <dt className="text-foreground/50">وقت الزفة</dt>
                <dd className="font-medium text-foreground">{weddingConfig.zaffaTime}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-foreground/50">المكان</dt>
                <dd className="font-medium text-foreground">{weddingConfig.venueName}</dd>
              </div>
            </dl>

            {weddingConfig.venueMapUrl && (
              <a
                href={weddingConfig.venueMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-8 inline-flex items-center gap-1.5 rounded-full border border-emerald/30 bg-emerald/5 px-4 py-2 text-xs font-medium text-emerald transition hover:bg-emerald/10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M12 2C7.86 2 4.5 5.36 4.5 9.5c0 5.25 6.5 11.5 7.02 11.97a.72.72 0 0 0 .96 0C13 21 19.5 14.75 19.5 9.5 19.5 5.36 16.14 2 12 2Zm0 10.25a2.75 2.75 0 1 1 0-5.5 2.75 2.75 0 0 1 0 5.5Z" />
                </svg>
                عرض الموقع على الخريطة
              </a>
            )}

            <div className="mx-auto w-fit rounded-2xl border border-gold/30 bg-white p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt="رمز الدخول الخاص بالدعوة"
                className="h-40 w-40 sm:h-48 sm:w-48"
              />
            </div>

            <div className="mt-4">
              <p className="text-xs text-foreground/50">أو الرمز المختصر</p>
              <p className="mt-1 font-serif text-2xl tracking-[0.4em] text-emerald">
                {guest.short_code}
              </p>
            </div>

            <p className="mt-4 text-xs text-foreground/50">
              يرجى إحضار هذه الدعوة (رمز QR أو الرمز المختصر) عند الحضور
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
