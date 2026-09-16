export default function InvalidInvite() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-night px-4 text-cream">
      <div className="w-full max-w-sm rounded-2xl border border-gold/25 bg-cream/[0.04] p-8 text-center">
        <p className="mb-2 text-3xl">⚠️</p>
        <h1 className="mb-2 font-calligraphy text-2xl text-gold-light">
          دعوة غير صالحة
        </h1>
        <p className="text-sm text-cream/60">
          هذا الرابط غير صحيح أو لم يعد متاحًا. يرجى التواصل مع منظم الحفل.
        </p>
      </div>
    </main>
  );
}
