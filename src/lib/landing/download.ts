/**
 * Configuración de descarga de la app.
 * ────────────────────────────────────
 * ESTADO ACTUAL: beta pública en TestFlight. La app es solo para iPhone.
 *   • Cuando la app salga en App Store: pon APPLE_LIVE = true y pega el enlace real en APPLE_URL.
 *   • Si cambia el enlace de TestFlight, actualízalo aquí y regenera public/qr-app.svg.
 */
export const APP_CONFIG = {
  name: "CitandoAndo",
  APPLE_LIVE: false,
  /** Enlace público de TestFlight (beta). */
  TESTFLIGHT_URL: "https://testflight.apple.com/join/CXMeSHE6",
  /** ⚠️ Pega aquí el enlace real de App Store (https://apps.apple.com/...) cuando se publique. */
  APPLE_URL: "#",
  WEB_URL: "https://citando-ando.vercel.app",
  CONTACT_EMAIL: "citando.ando.app@gmail.com",
};

export type Platform = "ios" | "other";

export function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent || "";
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  return "other";
}

/** Enlace de descarga que corresponde hoy: App Store si ya está publicada; si no, la beta de TestFlight. */
export function iosUrl(): string {
  return APP_CONFIG.APPLE_LIVE && APP_CONFIG.APPLE_URL !== "#" ? APP_CONFIG.APPLE_URL : APP_CONFIG.TESTFLIGHT_URL;
}

export function scrollToDownload() {
  document.getElementById("descargar")?.scrollIntoView({ behavior: "smooth" });
}

/**
 * Acción principal de descarga:
 *  · iPhone → abre App Store (o TestFlight mientras sea beta).
 *  · Cualquier otro dispositivo → baja a la sección de descarga (QR).
 */
export function smartDownload(): "opened" | "section" {
  if (detectPlatform() === "ios") {
    window.open(iosUrl(), "_blank", "noopener");
    return "opened";
  }
  scrollToDownload();
  return "section";
}
