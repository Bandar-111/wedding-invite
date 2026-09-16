// Wedding details — shown on every guest's invitation page.
export const weddingConfig = {
  pageTitle: "دعوة",
  topBlessing: "بارك الله لهما وبارك عليهما وجمع بينهما في خير",
  introLine: "بكل الحب والتقدير أتشرف بدعوتكم لحضور",
  eventTitle: "حفل زواجي",
  dinnerLine: "وتناول طعام العشاء وذلك بمشيئة الله",
  venueName: "قاعة يارا للإحتفالات",
  day: "يوم السبت",
  date: "١٧ أكتوبر ٢٠٢٦ م",
  hostLabel: "الداعي",
  hostName: "عبدالله محمد عمر العمودي",
  closingLine: "وحضوركم كريم لنا الفرح والسرور",
  venueMapUrl: "https://maps.app.goo.gl/JyhbqyZivAi4Mskq7?g_st=ic",
};

// Keep this short and easy to translate/edit — {link} is replaced with the guest's invitation URL.
export function buildWhatsAppMessage(link: string) {
  return `السلام عليكم،\nيسعدنا دعوتكم لحضور حفل زفافنا.\nهذه بطاقة الدعوة الخاصة بكم:\n${link}`;
}
