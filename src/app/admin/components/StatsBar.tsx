interface StatsBarProps {
  total: number;
  checkedIn: number;
}

export default function StatsBar({ total, checkedIn }: StatsBarProps) {
  const notCheckedIn = total - checkedIn;

  const stats = [
    { label: "إجمالي الضيوف", value: total, color: "text-emerald" },
    { label: "تم الحضور", value: checkedIn, color: "text-green-600" },
    { label: "لم يحضر بعد", value: notCheckedIn, color: "text-foreground/60" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl border border-black/5 bg-white px-3 py-4 text-center shadow-sm"
        >
          <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          <p className="mt-1 text-xs text-foreground/50">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
