import StaffLoginForm from "./StaffLoginForm";

export default function ScannerLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gold/20 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-center font-serif text-2xl text-emerald">
          ماسح دعوات الزفاف
        </h1>
        <p className="mb-6 text-center text-sm text-foreground/60">
          الرجاء إدخال رمز الدخول الخاص بالموظفين
        </p>
        <StaffLoginForm />
      </div>
    </main>
  );
}
