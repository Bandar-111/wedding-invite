// Wedding details — shown on every guest's invitation page.
export const weddingConfig = {
  topBlessing: "بارك الله لهما وبارك عليهما وجمع بينهما بقاعده",
  introText: "يكل ما تحمله قلوبنا من حب، ولأن فرحتنا لا تكتمل إلا بوجودكم",
  hostingTitle: "تتشرف السيدة",
  hostingName: "هدى عبدالله القاضي",
  invitationLine: "بدعوتكم لحضور حفل زفاف ابنها",
  groomName: "عبدالله بن محمد بارقبة",
  brideName: "سما بنت أحمد القاضي",
  date: "17-10-2026",
  day: "السبت",
  zaffaTime: "الساعة 12",
  venueName: "قاعة يارا للإحتفالات (حي الصفا)",
  venueMapUrl: "https://maps.app.goo.gl/JyhbqyZivAi4Mskq7?g_st=ic",
};

// Keep this short and easy to translate/edit — {link} is replaced with the guest's invitation URL.
export function buildWhatsAppMessage(link: string) {
  return `السلام عليكم،\nيسعدنا دعوتكم لحضور حفل زفافنا.\nهذه بطاقة الدعوة الخاصة بكم:\n${link}`;
}
