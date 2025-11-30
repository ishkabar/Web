import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Dominik Karczewski | Senior .NET Developer',
        short_name: 'DK',
        icons: [
            {
                src: '/web-app-manifest-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/web-app-manifest-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
        theme_color: '#512BD4',
        background_color: '#512BD4',
        display: 'standalone',
    }
}