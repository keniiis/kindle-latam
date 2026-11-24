/**
 * Textos de precio de la web, en un solo lugar.
 * ────────────────────────────────────────────
 * HAS_IAP = false → la app es 100 % gratis (versión 1.0).
 * HAS_IAP = true  → pásalo a true el día que se publique la versión con compras
 *                   puntuales dentro de la app (descarga gratis + extras opcionales).
 * Los botones "Descargar gratis" no cambian: descargarla sigue siendo gratis.
 */
export const HAS_IAP = true;

const freeLead = HAS_IAP ? "Gratis para empezar" : "Gratis";

export const COPY = {
  freeLead,
  /** "Gratis · Sin registro" */
  freeNoReg: `${freeLead} · Sin registro`,
  /** "Gratis y sin registro" */
  sentence: `${freeLead} y sin registro`,
  /** "Gratis y privada" (sin punto final) */
  priv: `${freeLead} y privada`,
  noUpload: `${freeLead}, sin registro y sin subir nada a ningún servidor.`,
  storeFree: HAS_IAP ? "Ya disponible en App Store · gratis para empezar" : "Ya disponible en App Store · gratis",
  layoutDesc: `App ${HAS_IAP ? "gratis para empezar" : "gratuita"} para iPhone, sin registro y privada.`,
  faqAnswer: HAS_IAP
    ? "Descargarla y usarla es gratis, sin registro y sin suscripciones. Si quieres más, existe Pro: un pago único y opcional dentro de la app."
    : "Es gratis, sin registro y sin suscripciones.",
  faqAnswerLong: HAS_IAP
    ? "Sí: descargarla es gratis, sin registro y sin suscripciones. La abres, importas tus citas y empiezas a diseñar. Si quieres personalizar más, existe Pro: un pago único y opcional que desbloquea el color libre, fondos con tu foto o la portada del libro, y stickers."
    : "Sí: es gratis, sin registro y sin suscripciones. La abres, importas tus citas y empiezas a diseñar.",
  /** Línea sobre Pro; solo existe cuando HAS_IAP = true. */
  proNote: HAS_IAP ? "Pro, opcional y de pago único: color libre, fondos con tu foto o la portada del libro, y stickers. Sin suscripción." : "",
};
