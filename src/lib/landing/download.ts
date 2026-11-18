/**
 * Configuración de descarga de la app.
 * ────────────────────────────────────
 * ESTADO ACTUAL: publicada en App Store (1.0). La app es solo para iPhone.
 *   • Si cambia el enlace de App Store, actualiza APPLE_URL aquí y regenera public/qr-app.svg.
 *   • TESTFLIGHT_URL queda solo como respaldo.
 */
export const APP_CONFIG = {
  name: "CitandoAndo",
  APPLE_LIVE: true,
  /** Enlace público de TestFlight (beta). */
  TESTFLIGHT_URL: "https://testflight.apple.com/join/CXMeSHE6",
  /** Enlace público de la app en App Store. */
  APPLE_URL: "https://apps.apple.com/app/id6832567501",
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

/** Baja hasta la tarjeta del QR (si no existe, hasta la sección de descarga). */
export function scrollToDownload() {
  const target = document.getElementById("qr-descarga") ?? document.getElementById("descargar");
  target?.scrollIntoView({ behavior: "smooth", block: "center" });
}

/**
 * Acción principal de descarga:
 *  · iPhone → abre App Store (o TestFlight mientras sea beta).
 *  · Cualquier otro dispositivo → baja hasta el QR para escanearlo con el móvil.
 */
export function smartDownload(): "opened" | "section" {
  if (detectPlatform() === "ios") {
    window.open(iosUrl(), "_blank", "noopener");
    return "opened";
  }
  scrollToDownload();
  return "section";
}
