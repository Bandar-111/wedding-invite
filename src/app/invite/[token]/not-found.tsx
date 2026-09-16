export default function InvalidInvite() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#fffdf8,_#f3ecdc)] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gold/30 bg-cream p-8 text-center shadow-sm">
        <p className="mb-2 text-3xl">⚠️</p>
        <h1 className="mb-2 font-serif text-2xl text-emerald">دعوة غير صالحة</h1>
        <p className="text-sm text-foreground/60">
          هذا الرابط غير صحيح أو لم يعد متاحًا. يرجى التواصل مع منظم الحفل.
        </p>
      </div>
    </main>
  );
}
