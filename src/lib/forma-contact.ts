export const FORMA_EMAIL = "formaeventandsecurity@gmail.com";
export const FORMA_PHONE = "+243 977 528 234";
export const FORMA_WHATSAPP = "https://wa.me/243977528234";
export const FORMA_ADDRESS = "144, av. Ngandu, Q/Mpasa I, C/Nsele, Kinshasa, RDC";

/** Accepte les formats congolais usuels : 0977528234, +243 977 528 234, 081 234 5678… */
export function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 15;
}

export function mailtoLink(subject: string, body: string) {
  return `mailto:${FORMA_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function whatsappLink(text: string) {
  return `${FORMA_WHATSAPP}?text=${encodeURIComponent(text)}`;
}
