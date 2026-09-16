import { notFound } from "next/navigation";
import { headers } from "next/headers";
import QRCode from "qrcode";
import { getSupabaseAdmin } from "@/lib/supabase";
import { weddingConfig } from "@/lib/wedding-config";

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

          <div className="relative px-7 py-10 text-center sm:px-10 sm:py-12">
            <p className="font-serif text-sm tracking-[0.3em] text-gold">
              بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ
            </p>

            <div className="mx-auto my-6 h-px w-16 bg-gold-light" />

            <p className="text-sm leading-7 text-foreground/70">
              {weddingConfig.hostingFamily}
              <br />
              يتشرفون بدعوتكم لحضور حفل زفاف
            </p>

            <h1 className="my-5 font-serif text-4xl leading-tight text-emerald sm:text-5xl">
              {weddingConfig.groomName}
              <span className="mx-3 text-gold">&</span>
              {weddingConfig.brideName}
            </h1>

            <div className="mx-auto my-6 h-px w-16 bg-gold-light" />

            <div className="mb-6 rounded-2xl bg-emerald/5 px-5 py-4">
              <p className="text-sm text-foreground/60">عزيزنا الضيف</p>
              <p className="mt-1 font-serif text-2xl text-emerald">{guest.full_name}</p>
              {guest.number_of_guests > 1 && (
                <p className="mt-1 text-xs text-foreground/50">
                  عدد المدعوين: {guest.number_of_guests}
                </p>
              )}
            </div>

            <dl className="mb-8 space-y-3 text-sm">
              <div className="flex items-center justify-between border-b border-black/5 pb-3">
                <dt className="text-foreground/50">التاريخ</dt>
                <dd className="font-medium text-foreground">
                  {weddingConfig.dateHijri}
                  <span className="block text-xs font-normal text-foreground/50">
                    {weddingConfig.dateGregorian}
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between border-b border-black/5 pb-3">
                <dt className="text-foreground/50">الوقت</dt>
                <dd className="font-medium text-foreground">{weddingConfig.time}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-foreground/50">المكان</dt>
                <dd className="font-medium text-foreground">
                  {weddingConfig.venueName}
                  <span className="block text-xs font-normal text-foreground/50">
                    {weddingConfig.venueAddress}
                  </span>
                </dd>
              </div>
            </dl>

            {weddingConfig.venueMapUrl && (
              <a
                href={weddingConfig.venueMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-8 inline-block text-xs font-medium text-emerald underline underline-offset-4"
              >
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
