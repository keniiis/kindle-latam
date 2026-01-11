import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Citando Ando',
        short_name: 'Citando',
        description: 'Tu segundo cerebro para notas de Kindle',
        start_url: '/',
        display: 'standalone',
        background_color: '#f7f5f8',
        theme_color: '#8c25f4',
        icons: [
            {
                src: '/icon',
                sizes: '192x192 512x512',
                type: 'image/png',
            },
        ],
    }
}