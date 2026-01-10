import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'CitandoAndo - Kindle to Instagram'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #4f46e5, #9333ea)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontFamily: 'sans-serif',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                    <h1 style={{ fontSize: 90, fontWeight: 900, margin: 0 }}>CitandoAndo</h1>
                </div>
                <p style={{ fontSize: 40, fontWeight: 500, marginTop: 20, opacity: 0.9 }}>
                    Tu Segundo Cerebro para Kindle
                </p>
                <div style={{ display: 'flex', marginTop: 40, gap: 20 }}>
                    <span style={{ padding: '10px 20px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, fontSize: 24 }}>Kindle</span>
                    <span style={{ padding: '10px 20px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, fontSize: 24 }}>Instagram</span>
                    <span style={{ padding: '10px 20px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, fontSize: 24 }}>Stories</span>
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
