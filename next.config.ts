import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image Optimization (Phase 9.1)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.sajuwooju.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Security Headers (Phase 9)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },

  // Performance Optimizations
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
