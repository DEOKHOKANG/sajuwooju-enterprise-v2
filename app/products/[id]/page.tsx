/**
 * Products Page - Redirect to Saju Contents
 * 기존 products 링크를 사주 콘텐츠로 연결합니다.
 */

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

// Product ID to Saju Content mapping
const PRODUCT_TO_CONTENT_MAP: Record<string, { categorySlug: string; contentSlug: string }> = {
  '1': { categorySlug: 'love-fortune', contentSlug: 'reunion-possibility' },
  '2': { categorySlug: 'love-fortune', contentSlug: 'crush-success-rate' },
  '3': { categorySlug: 'wealth-fortune', contentSlug: 'investment-timing' },
  '4': { categorySlug: 'career-fortune', contentSlug: 'promotion-possibility' },
  '5': { categorySlug: 'health-fortune', contentSlug: 'vitality-management' },
  '6': { categorySlug: 'compatibility', contentSlug: 'love-compatibility' },
  '7': { categorySlug: 'monthly-fortune', contentSlug: 'january-2025' },
  '8': { categorySlug: 'love-fortune', contentSlug: 'marriage-timing' },
  '9': { categorySlug: 'wealth-fortune', contentSlug: 'yearly-wealth-flow' },
  '10': { categorySlug: 'career-fortune', contentSlug: 'best-career-match' },
};

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  // Check static mapping first
  const mapped = PRODUCT_TO_CONTENT_MAP[id];
  if (mapped) {
    redirect(`/saju/${mapped.categorySlug}/${mapped.contentSlug}`);
  }

  // Try to find product by ID in database and get related content
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            category: true,
          },
          take: 1,
        },
      },
    });

    if (product && product.categories.length > 0) {
      const categorySlug = product.categories[0].category.slug;
      // Redirect to category page
      redirect(`/saju/${categorySlug}`);
    }
  } catch (error) {
    console.error('Error fetching product:', error);
  }

  // Default fallback - redirect to home
  redirect('/');
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const mapped = PRODUCT_TO_CONTENT_MAP[id];

  if (mapped) {
    return {
      title: '사주우주 | 프리미엄 사주 분석',
      description: '당신의 운명을 탐험하세요',
    };
  }

  return {
    title: '사주우주',
    description: 'AI 기반 프리미엄 사주 분석 서비스',
  };
}
