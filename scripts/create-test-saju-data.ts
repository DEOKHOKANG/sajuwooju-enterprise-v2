/**
 * Create Test Saju Data
 *
 * This script creates minimal test data for Saju categories, templates, and contents
 * to verify the /saju page works correctly in production.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestData() {
  console.log('🚀 Creating test Saju data...\n');

  try {
    // Check if data already exists
    const existingCategories = await prisma.sajuCategory.count();
    if (existingCategories > 0) {
      console.log(`✅ Found ${existingCategories} existing categories.`);
      const choice = process.argv[2];
      if (choice !== '--force') {
        console.log('Use --force to recreate data.');
        return;
      }
      console.log('🗑️  Deleting existing data...');
      await prisma.sajuContent.deleteMany();
      await prisma.sajuTemplate.deleteMany();
      await prisma.sajuCategory.deleteMany();
    }

    // Create categories
    console.log('📁 Creating categories...');
    const categories = await Promise.all([
      prisma.sajuCategory.create({
        data: {
          name: '연애운',
          slug: 'love-fortune',
          description: '사랑과 인연에 대한 운세를 확인하세요',
          shortDesc: '당신의 연애운을 확인해보세요',
          icon: '💕',
          color: '#FF6B9D',
          gradient: 'from-pink-500 to-rose-500',
          order: 1,
          isActive: true,
        },
      }),
      prisma.sajuCategory.create({
        data: {
          name: '재물운',
          slug: 'wealth-fortune',
          description: '금전과 재물에 대한 운세를 확인하세요',
          shortDesc: '당신의 재물운을 확인해보세요',
          icon: '💰',
          color: '#FFD700',
          gradient: 'from-amber-400 to-yellow-500',
          order: 2,
          isActive: true,
        },
      }),
      prisma.sajuCategory.create({
        data: {
          name: '직업운',
          slug: 'career-fortune',
          description: '진로와 커리어에 대한 운세를 확인하세요',
          shortDesc: '당신의 직업운을 확인해보세요',
          icon: '💼',
          color: '#4169E1',
          gradient: 'from-blue-500 to-indigo-500',
          order: 3,
          isActive: true,
        },
      }),
    ]);

    console.log(`✅ Created ${categories.length} categories`);

    // Create templates
    console.log('\n📝 Creating templates...');
    const templates = await Promise.all([
      // Love fortune templates
      prisma.sajuTemplate.create({
        data: {
          categoryId: categories[0].id,
          name: '오늘의 연애운',
          slug: 'daily-love',
          type: 'single',
          description: '오늘 하루의 연애운을 확인하세요',
          thumbnail: '💕',
          isActive: true,
          layout: {
            sections: [
              {
                type: 'header',
                title: '오늘의 연애운',
              },
              {
                type: 'content',
                key: 'description',
              },
              {
                type: 'score',
                key: 'loveScore',
                label: '연애운 점수',
              },
            ],
          },
          fields: {
            create: [
              {
                name: 'description',
                label: '설명',
                type: 'textarea',
                order: 1,
                validation: { required: true },
              },
              {
                name: 'loveScore',
                label: '점수',
                type: 'number',
                order: 2,
                validation: { required: true },
              },
            ],
          },
        },
      }),
      // Wealth fortune template
      prisma.sajuTemplate.create({
        data: {
          categoryId: categories[1].id,
          name: '이번 달 재물운',
          slug: 'monthly-wealth',
          type: 'timeline',
          description: '이번 달 재물운을 확인하세요',
          thumbnail: '💰',
          isActive: true,
          layout: {
            sections: [
              {
                type: 'header',
                title: '이번 달 재물운',
              },
              {
                type: 'timeline',
                key: 'timeline',
              },
            ],
          },
          fields: {
            create: [
              {
                name: 'timeline',
                label: '타임라인',
                type: 'json',
                order: 1,
                validation: { required: true },
              },
            ],
          },
        },
      }),
      // Career fortune template
      prisma.sajuTemplate.create({
        data: {
          categoryId: categories[2].id,
          name: '직업 적성 분석',
          slug: 'career-analysis',
          type: 'comparison',
          description: '나에게 맞는 직업을 찾아보세요',
          thumbnail: '💼',
          isActive: true,
          layout: {
            sections: [
              {
                type: 'header',
                title: '직업 적성 분석',
              },
              {
                type: 'comparison',
                key: 'careers',
              },
            ],
          },
          fields: {
            create: [
              {
                name: 'careers',
                label: '직업 목록',
                type: 'json',
                order: 1,
                validation: { required: true },
              },
            ],
          },
        },
      }),
    ]);

    console.log(`✅ Created ${templates.length} templates`);

    // Create sample contents
    console.log('\n📄 Creating sample contents...');
    const contents = await Promise.all([
      // Love content
      prisma.sajuContent.create({
        data: {
          templateId: templates[0].id,
          title: '2025년 1월 연애운',
          slug: '2025-01-love-fortune',
          excerpt: '새해를 맞아 새로운 인연이 찾아올 예감이 듭니다',
          data: {
            description: '2025년 1월, 당신의 연애운은 상승세를 타고 있습니다. 새로운 사람을 만나거나 기존 관계가 발전할 가능성이 높습니다.',
            loveScore: 85,
          },
          status: 'published',
          publishedAt: new Date(),
          viewCount: 0,
          seoTitle: '2025년 1월 연애운 | 사주우주',
          seoDescription: '새해 첫 달의 연애운을 확인하세요',
          seoKeywords: ['연애운', '2025년', '1월', '사주'],
        },
      }),
      prisma.sajuContent.create({
        data: {
          templateId: templates[0].id,
          title: '겨울철 만남 운세',
          slug: 'winter-meeting-fortune',
          excerpt: '겨울에 만나는 인연은 특별합니다',
          data: {
            description: '추운 겨울, 따뜻한 만남이 기다리고 있습니다. 실내 데이트를 추천합니다.',
            loveScore: 78,
          },
          status: 'published',
          publishedAt: new Date(Date.now() - 86400000), // 1 day ago
          viewCount: 42,
          seoTitle: '겨울철 만남 운세 | 사주우주',
          seoDescription: '겨울에 만나는 특별한 인연',
          seoKeywords: ['연애운', '겨울', '만남', '데이트'],
        },
      }),
      // Wealth content
      prisma.sajuContent.create({
        data: {
          templateId: templates[1].id,
          title: '1월 재물운 타임라인',
          slug: 'january-wealth-timeline',
          excerpt: '이번 달 재물운의 흐름을 확인하세요',
          data: {
            timeline: [
              {
                period: '1월 1-10일',
                score: 75,
                label: '초반',
                description: '안정적인 수입이 예상됩니다',
              },
              {
                period: '1월 11-20일',
                score: 90,
                label: '중반',
                description: '큰 기회가 찾아올 수 있습니다',
              },
              {
                period: '1월 21-31일',
                score: 65,
                label: '말',
                description: '지출 관리가 필요한 시기입니다',
              },
            ],
          },
          status: 'published',
          publishedAt: new Date(),
          viewCount: 128,
          seoTitle: '1월 재물운 타임라인 | 사주우주',
          seoDescription: '이번 달 재물운의 흐름',
          seoKeywords: ['재물운', '1월', '타임라인'],
        },
      }),
      // Career content
      prisma.sajuContent.create({
        data: {
          templateId: templates[2].id,
          title: '나에게 맞는 직업 찾기',
          slug: 'find-your-career',
          excerpt: '사주 분석으로 적성을 확인하세요',
          data: {
            careers: [
              {
                name: '창업',
                score: 85,
                description: '독립적인 성향이 강해 창업이 잘 맞습니다',
              },
              {
                name: '교육',
                score: 70,
                description: '사람을 가르치는 재능이 있습니다',
              },
              {
                name: '예술',
                score: 60,
                description: '창의적인 면모가 있습니다',
              },
            ],
          },
          status: 'published',
          publishedAt: new Date(Date.now() - 172800000), // 2 days ago
          viewCount: 256,
          seoTitle: '나에게 맞는 직업 찾기 | 사주우주',
          seoDescription: '사주로 보는 직업 적성',
          seoKeywords: ['직업운', '적성', '사주 분석'],
        },
      }),
    ]);

    console.log(`✅ Created ${contents.length} sample contents`);

    // Summary
    console.log('\n✨ Test data creation complete!');
    console.log(`
📊 Summary:
   - Categories: ${categories.length}
   - Templates: ${templates.length}
   - Contents: ${contents.length}

🔗 Test URLs:
   - Main: /saju
   - Love: /saju/love-fortune
   - Wealth: /saju/wealth-fortune
   - Career: /saju/career-fortune
   - Sample content: /saju/love-fortune/2025-01-love-fortune
`);
  } catch (error) {
    console.error('❌ Error creating test data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createTestData()
  .then(() => {
    console.log('✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed:', error);
    process.exit(1);
  });
