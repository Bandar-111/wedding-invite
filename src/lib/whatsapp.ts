// Best-effort normalization to Saudi/international format for wa.me links.
// If the number doesn't look like a recognizable local/international
// number, we fall back to a generic wa.me link (no phone) so the admin can
// still pick a contact manually inside WhatsApp.
export function buildWhatsAppUrl(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  let normalized = digits;

  if (digits.startsWith("966")) {
    normalized = digits;
  } else if (digits.startsWith("05") && digits.length === 10) {
    normalized = `966${digits.slice(1)}`;
  } else if (digits.startsWith("5") && digits.length === 9) {
    normalized = `966${digits}`;
  }

  const text = encodeURIComponent(message);
  if (normalized.length >= 10) {
    return `https://wa.me/${normalized}?text=${text}`;
  }
  return `https://wa.me/?text=${text}`;
}
