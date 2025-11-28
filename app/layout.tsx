import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/contexts/toast-context";
// Navigation removed for simplified version
// import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
// import { MobileHeader } from "@/components/layout/mobile-header";
import { SessionProvider } from "next-auth/react";
import Script from "next/script";

// Phase 9.2: Font Optimization with next/font
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
  preload: true,
});

// Phase 9.4: SEO Optimization - Complete Metadata
// 프로덕션 URL 동적 생성 (하드코딩 제거)
const getSiteUrl = () => {
  // 1순위: 명시적 환경 변수
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // 2순위: Vercel 자동 URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 3순위: 개발 환경 폴백
  return 'http://localhost:3000';
};

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "사주우주 | 우주의 법칙으로 읽는 나의 운명",
    template: "%s | 사주우주",
  },
  description: "사주우주는 우주의 9개 행성과 음양오행을 기반으로 당신의 사주를 분석합니다. AI 기반의 정확한 운세와 궁합 서비스를 제공합니다.",
  keywords: ["사주", "사주우주", "운세", "궁합", "만세력", "음양오행", "행성", "우주", "천문학", "사주 분석", "AI 사주", "무료 사주"],
  authors: [{ name: "사주우주" }],
  creator: "사주우주",
  publisher: "사주우주",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: siteUrl,  // 동적 URL 사용
    siteName: '사주우주',
    title: "사주우주 | 우주의 법칙으로 읽는 나의 운명",
    description: "사주우주는 우주의 9개 행성과 음양오행을 기반으로 당신의 사주를 분석합니다. AI 기반의 정확한 운세와 궁합 서비스를 제공합니다.",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '사주우주 - 우주의 법칙으로 읽는 나의 운명',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "사주우주 | 우주의 법칙으로 읽는 나의 운명",
    description: "사주우주는 우주의 9개 행성과 음양오행을 기반으로 당신의 사주를 분석합니다.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
    // Add your verification codes when available
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={spaceGrotesk.variable}>
      <head>
        {/* Pretendard Font - Korean */}
        <link
          rel="preload"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="antialiased">
        <SessionProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </SessionProvider>

        {/* Kakao SDK (for Phase 11 - Login) */}
        <Script
          src="https://developers.kakao.com/sdk/js/kakao.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
