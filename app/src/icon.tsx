import { ImageResponse } from 'next/og'

// Configuración de la imagen
export const runtime = 'edge'
export const size = {
    width: 512,
    height: 512,
}
export const contentType = 'image/png'

// Generación del icono
export default function Icon() {
    return new ImageResponse(
        (
            // Elemento JSX que se convertirá en imagen
            <div
                style={{
                    fontSize: 300,
                    background: 'linear-gradient(to bottom right, #4f46e5, #818cf8)', // Degradado Indigo
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    borderRadius: '18%', // Bordes redondeados tipo App móvil
                    fontWeight: 800,
                    fontFamily: 'sans-serif',
                }}
            >
                CA
            </div>
        ),
        {
            ...size,
        }
    )
}