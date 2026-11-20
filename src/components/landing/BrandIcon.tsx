/* eslint-disable @next/next/no-img-element */
/**
 * Icono real de CitandoAndo (el mismo de la app).
 * Por defecto es decorativo (alt vacío): siempre va junto al nombre escrito,
 * y repetirlo hace que los lectores de pantalla lo lean dos veces.
 */
export default function BrandIcon({ size = 40, alt = "" }: { size?: number; radius?: number; alt?: string }) {
  return (
    <img
      src="/icon.png"
      width={size}
      height={size}
      alt={alt}
      style={{ width: size, height: size, borderRadius: size * 0.2237, display: "block" }}
    />
  );
}
