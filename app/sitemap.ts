import { MetadataRoute } from 'next';

// 동적 사이트 URL 생성 (하드코딩 제거)
const getSiteUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
};

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const currentDate = new Date();

  // 메인 페이지
  const mainPage = {
    url: siteUrl,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: 1.0,
  };

  // 12개 카테고리 페이지
  const categories = [
    'love-fortune',      // 사랑운
    'career-fortune',    // 직업운
    'wealth-fortune',    // 재물운
    'health-fortune',    // 건강운
    'academic-fortune',  // 학업운
    'family-fortune',    // 가족운
    'personality-analysis', // 성격 분석
    'yearly-fortune',    // 연간 운세
    'monthly-fortune',   // 월간 운세
    'today-fortune',     // 오늘의 운세
    'life-reading',      // 평생 운세
    'compatibility',     // 궁합
  ];

  const categoryPages = categories.map(slug => ({
    url: `${siteUrl}/saju/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [mainPage, ...categoryPages];
}
