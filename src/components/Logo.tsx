/* eslint-disable @next/next/no-img-element */
/** Marca de CitandoAndo: el mismo ícono que la app (public/icon.png). */
export default function Logo({ size = 32, className = '' }: { size?: number; className?: string }) {
    return (
        <img
            src="/icon.png"
            alt=""
            width={size}
            height={size}
            className={className}
            style={{ width: size, height: size, borderRadius: size * 0.2237 }}
        />
    );
}
