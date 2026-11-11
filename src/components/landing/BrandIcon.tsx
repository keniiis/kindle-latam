/* eslint-disable @next/next/no-img-element */
/** Icono real de CitandoAndo (el mismo de la app). */
export default function BrandIcon({ size = 40 }: { size?: number; radius?: number }) {
  return (
    <img
      src="/icon.png"
      width={size}
      height={size}
      alt="CitandoAndo"
      style={{ width: size, height: size, borderRadius: size * 0.2237, display: "block" }}
    />
  );
}
