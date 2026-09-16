// Placeholder wedding details — edit these before sending invitations.
export const weddingConfig = {
  groomName: "عبدالله",
  brideName: "سارة",
  hostingFamily: "عائلتا العريس والعروس",
  dateHijri: "١٥ رجب ١٤٤٧هـ",
  dateGregorian: "الموافق ٣ يناير ٢٠٢٦م",
  time: "الساعة الثامنة مساءً",
  venueName: "قاعة الأفراح",
  venueAddress: "الرياض، المملكة العربية السعودية",
  venueMapUrl: "https://maps.google.com",
};

// Keep this short and easy to translate/edit — {link} is replaced with the guest's invitation URL.
export function buildWhatsAppMessage(link: string) {
  return `السلام عليكم،\nيسعدنا دعوتكم لحضور حفل زفافنا.\nهذه بطاقة الدعوة الخاصة بكم:\n${link}`;
}
