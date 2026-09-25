import type { NextConfig } from 'next';
import './lib/env';

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 85],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            // CSP yang lebih aman dan sudah mengizinkan koneksi Sanity API serta Iframe Studio
            value: "default-src 'self'; frame-src 'self' https://app.sandbox.midtrans.com https://app.midtrans.com; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://app.sandbox.midtrans.com https://app.midtrans.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://*.sanity.io wss://*.sanity.io https://app.sandbox.midtrans.com https://app.midtrans.com; frame-ancestors 'self' https://*.sanity.io https://sanity.io;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;