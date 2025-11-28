/**
 * Prisma Seed Script - Product & Category Data
 * Phase 6: 기존 하드코딩된 제품 데이터를 데이터베이스로 마이그레이션
 */

import { PrismaClient } from '@prisma/client';
import { FEATURED_PRODUCTS } from '../lib/products-data';

const prisma = new PrismaClient();

// 카테고리 데이터 정의
const CATEGORIES = [
  {
    name: '이벤트',
    slug: 'event',
    description: '특별 이벤트 및 프로모션 제품',
    icon: '🎉',
    color: '#FF6B6B',
    gradient: 'from-pink-500 to-rose-500',
    order: 1,
  },
  {
    name: '궁합',
    slug: 'compatibility',
    description: '연인, 친구, 가족과의 궁합 분석',
    icon: '💑',
    color: '#FF69B4',
    gradient: 'from-pink-400 to-rose-400',
    order: 2,
  },
  {
    name: '솔로/연애운',
    slug: 'love',
    description: '연애운, 솔로 탈출, 이성운 분석',
    icon: '💕',
    color: '#FF1493',
    gradient: 'from-rose-400 to-pink-400',
    order: 3,
  },
  {
    name: '이별/재회',
    slug: 'breakup-reunion',
    description: '이별 후 재회 가능성 및 극복 방법',
    icon: '💔',
    color: '#DC143C',
    gradient: 'from-red-400 to-rose-400',
    order: 4,
  },
  {
    name: '결혼운',
    slug: 'marriage',
    description: '결혼 시기, 결혼 궁합 분석',
    icon: '💍',
    color: '#FFD700',
    gradient: 'from-amber-400 to-orange-400',
    order: 5,
  },
  {
    name: '직장/직업운',
    slug: 'career',
    description: '취업, 이직, 승진, 커리어 분석',
    icon: '💼',
    color: '#4169E1',
    gradient: 'from-blue-500 to-indigo-500',
    order: 6,
  },
  {
    name: '신년운세',
    slug: 'new-year',
    description: '새해 종합 운세 및 연간 운세',
    icon: '🎊',
    color: '#FFD700',
    gradient: 'from-yellow-400 to-amber-500',
    order: 7,
  },
  {
    name: '월별운세',
    slug: 'monthly',
    description: '매월 운세 및 월간 흐름 분석',
    icon: '📅',
    color: '#9370DB',
    gradient: 'from-purple-400 to-indigo-400',
    order: 8,
  },
  {
    name: '취업/직업운',
    slug: 'employment',
    description: '취업 시기, 적성 분석',
    icon: '🎯',
    color: '#20B2AA',
    gradient: 'from-teal-400 to-cyan-400',
    order: 9,
  },
  {
    name: '관상/타로',
    slug: 'fortune-telling',
    description: '관상, 타로, 기타 점술',
    icon: '🔮',
    color: '#9370DB',
    gradient: 'from-purple-500 to-pink-500',
    order: 10,
  },
  {
    name: '건강운',
    slug: 'health',
    description: '건강 운세 및 건강 관리',
    icon: '💪',
    color: '#32CD32',
    gradient: 'from-green-400 to-emerald-400',
    order: 11,
  },
  {
    name: '학업운',
    slug: 'education',
    description: '시험, 학업 성적, 진학 운세',
    icon: '📚',
    color: '#4169E1',
    gradient: 'from-blue-400 to-sky-400',
    order: 12,
  },
  {
    name: '투자/부동산',
    slug: 'investment',
    description: '투자 시기, 부동산 운세',
    icon: '🏠',
    color: '#DAA520',
    gradient: 'from-amber-500 to-yellow-500',
    order: 13,
  },
  {
    name: '재물운',
    slug: 'wealth',
    description: '재물운, 금전운, 돈복 분석',
    icon: '💰',
    color: '#FFD700',
    gradient: 'from-yellow-500 to-amber-500',
    order: 14,
  },
];

// 카테고리 ID 매핑 (기존 categoryIds → slug)
const CATEGORY_ID_TO_SLUG: Record<number, string> = {
  1: 'event',
  2: 'compatibility',
  3: 'love',
  4: 'breakup-reunion',
  5: 'marriage',
  6: 'career',
  7: 'new-year',
  8: 'monthly',
  9: 'employment',
  10: 'fortune-telling',
  11: 'health',
  12: 'education',
  13: 'investment',
  14: 'wealth',
};

async function main() {
  console.log('🌱 Starting seed...\n');

  // 1. 카테고리 생성
  console.log('📁 Creating categories...');
  const categoryMap = new Map<string, string>(); // slug → id

  for (const categoryData of CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: categoryData,
      create: categoryData,
    });
    categoryMap.set(category.slug, category.id);
    console.log(`  ✅ ${category.name} (${category.slug})`);
  }

  console.log(`\n✅ Created ${CATEGORIES.length} categories\n`);

  // 2. 제품 생성 및 카테고리 연결
  console.log('📦 Creating products...');

  for (const product of FEATURED_PRODUCTS) {
    // 가격 계산
    const basePrice = 10000;
    const finalPrice = Math.round(basePrice * (1 - product.discount / 100));

    // 제품 생성
    const createdProduct = await prisma.product.create({
      data: {
        title: product.title,
        slug: `product-${product.id}`,
        subtitle: product.subtitle,
        shortDescription: product.subtitle, // 상세 설명 (추후 개선 가능)
        fullDescription: product.subtitle,
        features: [],
        price: basePrice,
        discountPrice: finalPrice,
        discount: product.discount,
        rating: product.rating,
        views: parseInt(product.views.replace(/[^0-9]/g, '')) || 0, // '5만+' → 50000
        reviewCount: 0,
        purchaseCount: 0,
        imageUrl: product.image,
        thumbnailUrl: product.image, // 동일 이미지 사용
        images: [product.image], // 배열로 변환
        isActive: true,
        isFeatured: true, // 모든 FEATURED_PRODUCTS는 featured로 설정
        isPremium: false,
        order: product.id,
        seoKeywords: [product.title, product.subtitle],
      },
    });

    // 카테고리 연결
    const categoryIds = product.categoryIds || [];
    for (const categoryId of categoryIds) {
      const categorySlug = CATEGORY_ID_TO_SLUG[categoryId];
      const prismaCategoryId = categoryMap.get(categorySlug);

      if (prismaCategoryId) {
        await prisma.productCategory.create({
          data: {
            productId: createdProduct.id,
            categoryId: prismaCategoryId,
            order: 0,
          },
        });
      }
    }

    console.log(`  ✅ ${createdProduct.title} (${categoryIds.length} categories)`);
  }

  console.log(`\n✅ Created ${FEATURED_PRODUCTS.length} products\n`);

  // 3. 통계 출력
  const totalCategories = await prisma.category.count();
  const totalProducts = await prisma.product.count();
  const totalRelations = await prisma.productCategory.count();

  console.log('📊 Seed Summary:');
  console.log(`  • Categories: ${totalCategories}`);
  console.log(`  • Products: ${totalProducts}`);
  console.log(`  • Category Relations: ${totalRelations}`);
  console.log('\n✨ Seed completed successfully!\n');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('\n❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
