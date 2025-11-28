import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

declare const process: any;

const prisma = new PrismaClient();

const CATEGORY_DATA = [
  {
    name: 'Love & Relationship',
    slug: 'love-fortune',
    description: 'Compatibility readings, reunion probability, and daily connection tips.',
    icon: 'heart',
    color: '#FF6B9D',
    gradient: 'from-pink-500 to-rose-500',
    order: 1,
    isActive: true,
  },
  {
    name: 'Wealth & Business',
    slug: 'wealth-fortune',
    description: 'Financial timing, cash-flow guardrails, and negotiation prompts.',
    icon: 'coin',
    color: '#FFD700',
    gradient: 'from-amber-400 to-yellow-500',
    order: 2,
    isActive: true,
  },
  {
    name: 'Career & Growth',
    slug: 'career-fortune',
    description: 'Promotion signals, leadership archetypes, and burnout radar.',
    icon: 'briefcase',
    color: '#4169E1',
    gradient: 'from-blue-500 to-indigo-500',
    order: 3,
    isActive: true,
  },
  {
    name: 'Health & Vitality',
    slug: 'health-fortune',
    description: 'Energy balance, rest planning, and recovery guardrails.',
    icon: 'pulse',
    color: '#32CD32',
    gradient: 'from-green-500 to-emerald-500',
    order: 4,
    isActive: true,
  },
  {
    name: 'Monthly Outlook',
    slug: 'monthly-fortune',
    description: 'Thirty-day planning cues with element-specific reminders.',
    icon: 'calendar',
    color: '#7C3AED',
    gradient: 'from-purple-500 to-indigo-600',
    order: 5,
    isActive: true,
  },
  {
    name: 'Compatibility Premium',
    slug: 'compatibility',
    description: 'High fidelity dual readings for couples, friends, and cofounders.',
    icon: 'link',
    color: '#FF1493',
    gradient: 'from-rose-500 to-fuchsia-600',
    order: 6,
    isActive: true,
  },
];

const PRODUCT_DATA = [
  {
    title: 'Essential Birth Chart',
    slug: 'essential-birth-chart',
    subtitle: 'Baseline insights for new members',
    shortDescription: 'Four-pillar decoding with elemental rhythm and lucky-window mapping.',
    fullDescription:
      'The Essential Birth Chart experience converts raw birth data into a guided overview. Members receive a summary of their yin-yang ratio, dominant elements, favorable partners, and practical guardrails for the next quarter.',
    features: [
      'Elemental balance digest',
      'Daily energy guardrails',
      'Lucky hour and color reference',
      '90-day milestone roadmap',
    ],
    price: 18000,
    discountPrice: 12000,
    discount: 33,
    rating: 4.8,
    reviewCount: 1240,
    views: 52000,
    purchaseCount: 860,
    imageUrl: 'https://assets.sajuwooju.com/products/essential-birth-chart.png',
    thumbnailUrl: 'https://assets.sajuwooju.com/products/essential-birth-chart-thumb.png',
    images: [
      'https://assets.sajuwooju.com/products/essential-birth-chart.png',
      'https://assets.sajuwooju.com/products/essential-birth-chart-detail.png',
    ],
    isActive: true,
    isFeatured: true,
    isPremium: false,
    order: 1,
    seoTitle: 'Essential Birth Chart | SajuWooju Enterprise',
    seoDescription: 'Quick-start birth chart reading with elemental scoring and practical next steps.',
    seoKeywords: ['birth chart', 'intro reading', 'four pillars'],
    publishedAt: new Date(),
    categorySlugs: ['love-fortune', 'monthly-fortune'],
  },
  {
    title: 'Premium Love Alignment',
    slug: 'premium-love-alignment',
    subtitle: 'High-resolution compatibility briefing',
    shortDescription: 'Dual-profile modeling, reunion probability, and meaningful date planning.',
    fullDescription:
      'Premium Love Alignment blends two charts into a single compatibility dashboard. It highlights shared elements, pressure points, reunion timelines, and red-flag behaviors. Concierge prompts help members translate guidance into daily rituals.',
    features: [
      'Compatibility readiness index',
      'Reunion and separation timeline',
      'Communication style decoder',
      'Weekly ritual checklist',
    ],
    price: 38000,
    discountPrice: 29000,
    discount: 24,
    rating: 4.92,
    reviewCount: 2143,
    views: 68500,
    purchaseCount: 1430,
    imageUrl: 'https://assets.sajuwooju.com/products/premium-love-alignment.png',
    thumbnailUrl: 'https://assets.sajuwooju.com/products/premium-love-alignment-thumb.png',
    images: [
      'https://assets.sajuwooju.com/products/premium-love-alignment.png',
      'https://assets.sajuwooju.com/products/premium-love-alignment-steps.png',
    ],
    isActive: true,
    isFeatured: true,
    isPremium: true,
    order: 2,
    seoTitle: 'Premium Love Alignment | SajuWooju Enterprise',
    seoDescription: 'Enterprise-grade compatibility analysis for couples and reunion planning.',
    seoKeywords: ['love fortune', 'compatibility', 'relationship reading'],
    publishedAt: new Date(),
    categorySlugs: ['love-fortune', 'compatibility'],
  },
  {
    title: 'Wealth Strategy Suite',
    slug: 'wealth-strategy-suite',
    subtitle: 'Capital flow and decision readiness',
    shortDescription: 'Cash-flow guardrails, opportunity radar, and launch window detection.',
    fullDescription:
      'Wealth Strategy Suite is tuned for founders and operators who need clarity on personal timing. The report grades risk tolerance, outlines annual liquidity windows, and pairs them with negotiation prompts.',
    features: [
      'Annual liquidity grid',
      'Negotiation tone guidance',
      'Element-driven spending caps',
      'Investment caution checklist',
    ],
    price: 54000,
    discountPrice: 42000,
    discount: 22,
    rating: 4.86,
    reviewCount: 980,
    views: 40200,
    purchaseCount: 690,
    imageUrl: 'https://assets.sajuwooju.com/products/wealth-strategy-suite.png',
    thumbnailUrl: 'https://assets.sajuwooju.com/products/wealth-strategy-suite-thumb.png',
    images: [
      'https://assets.sajuwooju.com/products/wealth-strategy-suite.png',
      'https://assets.sajuwooju.com/products/wealth-strategy-suite-detail.png',
    ],
    isActive: true,
    isFeatured: true,
    isPremium: true,
    order: 3,
    seoTitle: 'Wealth Strategy Suite | SajuWooju Enterprise',
    seoDescription: 'Financial readiness scorecard with launch windows and mitigation tactics.',
    seoKeywords: ['wealth fortune', 'business timing', 'investment ai'],
    publishedAt: new Date(),
    categorySlugs: ['wealth-fortune', 'monthly-fortune'],
  },
  {
    title: 'Executive Career Map',
    slug: 'executive-career-map',
    subtitle: 'Role navigation for high-velocity teams',
    shortDescription: 'Promotion signals, burnout radar, and leadership archetypes.',
    fullDescription:
      'Executive Career Map clarifies how a leader should deploy energy for the next twelve months. It includes meeting choreography, travel cadence suggestions, and people-risk warnings tailored to elemental distribution.',
    features: [
      'Leadership archetype snapshot',
      'Promotion probability timeline',
      'People-risk early warning list',
      'Travel and meeting cadence guide',
    ],
    price: 42000,
    discountPrice: 34000,
    discount: 19,
    rating: 4.74,
    reviewCount: 756,
    views: 28800,
    purchaseCount: 540,
    imageUrl: 'https://assets.sajuwooju.com/products/executive-career-map.png',
    thumbnailUrl: 'https://assets.sajuwooju.com/products/executive-career-map-thumb.png',
    images: [
      'https://assets.sajuwooju.com/products/executive-career-map.png',
      'https://assets.sajuwooju.com/products/executive-career-map-detail.png',
    ],
    isActive: true,
    isFeatured: false,
    isPremium: true,
    order: 4,
    seoTitle: 'Executive Career Map | SajuWooju Enterprise',
    seoDescription: 'Career acceleration briefing focused on leadership cadence and resilience.',
    seoKeywords: ['career fortune', 'leadership reading'],
    publishedAt: new Date(),
    categorySlugs: ['career-fortune', 'health-fortune'],
  },
  {
    title: 'Platinum All Access',
    slug: 'platinum-all-access',
    subtitle: 'Concierge-grade omnichannel mentoring',
    shortDescription: 'Twelve-category coverage, analyst follow-ups, and live prompts.',
    fullDescription:
      'Platinum All Access bundles every premium reading, quarterly analyst calls, and emergency push notifications for major transits. It is designed for enterprise customers who need a unified view across love, finance, health, and social reputation.',
    features: [
      'All category unlock',
      'Quarterly analyst session',
      'Priority push notifications',
      'Concierge support channel',
    ],
    price: 210000,
    discountPrice: 165000,
    discount: 21,
    rating: 4.95,
    reviewCount: 312,
    views: 15800,
    purchaseCount: 190,
    imageUrl: 'https://assets.sajuwooju.com/products/platinum-all-access.png',
    thumbnailUrl: 'https://assets.sajuwooju.com/products/platinum-all-access-thumb.png',
    images: [
      'https://assets.sajuwooju.com/products/platinum-all-access.png',
      'https://assets.sajuwooju.com/products/platinum-all-access-detail.png',
    ],
    isActive: true,
    isFeatured: true,
    isPremium: true,
    order: 5,
    seoTitle: 'Platinum All Access | SajuWooju Enterprise',
    seoDescription: 'Enterprise concierge program with full-stack readings and analyst support.',
    seoKeywords: ['platinum saju', 'enterprise concierge'],
    publishedAt: new Date(),
    categorySlugs: ['love-fortune', 'wealth-fortune', 'career-fortune', 'compatibility'],
  },
];

const USER_DATA = [
  {
    name: 'Olivia Park',
    email: 'olivia@example.com',
    image: 'https://assets.sajuwooju.com/avatars/olivia.png',
    provider: 'kakao',
    providerAccountId: 'kakao_123456',
  },
  {
    name: 'Jinwoo Han',
    email: 'jinwoo@example.com',
    image: 'https://assets.sajuwooju.com/avatars/jinwoo.png',
    provider: 'google',
    providerAccountId: 'google_987654',
  },
  {
    name: 'Mina Choi',
    email: 'mina@example.com',
    image: 'https://assets.sajuwooju.com/avatars/mina.png',
    provider: 'kakao',
    providerAccountId: 'kakao_555111',
  },
];

// Phase 1.6: Saju Content Categories
const SAJU_CATEGORY_DATA = [
  {
    name: '궁합',
    slug: 'compatibility',
    icon: 'Heart',
    color: 'pink',
    gradient: 'from-pink-500 to-rose-500',
    description: '두 사람의 사주를 비교하여 궁합을 분석합니다',
    shortDesc: '연인, 부부, 친구 관계 궁합 분석',
    order: 1,
    isActive: true,
  },
  {
    name: '연애운',
    slug: 'love',
    icon: 'HeartHandshake',
    color: 'rose',
    gradient: 'from-rose-500 to-pink-600',
    description: '연애와 만남에 대한 운세를 분석합니다',
    shortDesc: '이성 만남, 연애 타이밍 분석',
    order: 2,
    isActive: true,
  },
  {
    name: '이별/재회',
    slug: 'breakup-reunion',
    icon: 'HeartCrack',
    color: 'purple',
    gradient: 'from-purple-500 to-indigo-500',
    description: '이별 후 재회 가능성과 시기를 분석합니다',
    shortDesc: '재회 가능성, 극복 방법 제시',
    order: 3,
    isActive: true,
  },
  {
    name: '결혼운',
    slug: 'marriage',
    icon: 'Rings',
    color: 'indigo',
    gradient: 'from-indigo-500 to-blue-500',
    description: '결혼 시기와 배우자 운을 분석합니다',
    shortDesc: '결혼 적기, 배우자 특징 분석',
    order: 4,
    isActive: true,
  },
  {
    name: '취업운',
    slug: 'career',
    icon: 'Briefcase',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500',
    description: '직업운과 취업 시기를 분석합니다',
    shortDesc: '적성 직업, 이직/취업 타이밍',
    order: 5,
    isActive: true,
  },
  {
    name: '신년운세',
    slug: 'new-year',
    icon: 'Sparkles',
    color: 'amber',
    gradient: 'from-amber-500 to-orange-500',
    description: '새해 전체 운세를 종합적으로 분석합니다',
    shortDesc: '연간 운세, 월별 핵심 포인트',
    order: 6,
    isActive: true,
  },
  {
    name: '월간운세',
    slug: 'monthly',
    icon: 'Calendar',
    color: 'green',
    gradient: 'from-green-500 to-emerald-500',
    description: '매월 운세를 상세히 분석합니다',
    shortDesc: '이번 달 운세, 주요 이슈',
    order: 7,
    isActive: true,
  },
  {
    name: '이벤트',
    slug: 'event',
    icon: 'Gift',
    color: 'yellow',
    gradient: 'from-yellow-500 to-amber-500',
    description: '특별 이벤트 및 프로모션 컨텐츠',
    shortDesc: '시즌 특별 운세, 프로모션',
    order: 8,
    isActive: true,
  },
];

// Phase 1.6: Sample Saju Templates
const SAJU_TEMPLATE_DATA = [
  {
    categorySlug: 'compatibility',
    name: '기본 궁합 분석',
    slug: 'basic-compatibility',
    type: 'comparison',
    layout: {
      sections: [
        { type: 'hero', title: '궁합 분석 결과' },
        { type: 'compatibility-meter', label: '궁합 점수' },
        { type: 'element-analysis', label: '오행 분석' },
        { type: 'insights', label: '상세 분석' },
        { type: 'recommendations', label: '조언' },
      ],
      theme: {
        primaryColor: 'pink',
        gradient: 'from-pink-500 to-rose-500',
      },
    },
    thumbnail: 'https://assets.sajuwooju.com/templates/basic-compatibility.png',
    isActive: true,
  },
  {
    categorySlug: 'love',
    name: '연애운 타임라인',
    slug: 'love-timeline',
    type: 'timeline',
    layout: {
      sections: [
        { type: 'hero', title: '연애운 분석' },
        { type: 'timeline', label: '월별 연애운' },
        { type: 'element-circle', label: '내 오행' },
        { type: 'insights', label: '연애 팁' },
      ],
      theme: {
        primaryColor: 'rose',
        gradient: 'from-rose-500 to-pink-600',
      },
    },
    thumbnail: 'https://assets.sajuwooju.com/templates/love-timeline.png',
    isActive: true,
  },
  {
    categorySlug: 'career',
    name: '취업운 종합 분석',
    slug: 'career-comprehensive',
    type: 'single',
    layout: {
      sections: [
        { type: 'hero', title: '취업운 분석' },
        { type: 'fortune-card', label: '종합 운세' },
        { type: 'element-badge', label: '적성 분야' },
        { type: 'insights', label: '취업 전략' },
        { type: 'recommendations', label: '행동 가이드' },
      ],
      theme: {
        primaryColor: 'blue',
        gradient: 'from-blue-500 to-cyan-500',
      },
    },
    thumbnail: 'https://assets.sajuwooju.com/templates/career-comprehensive.png',
    isActive: true,
  },
];

async function seedAdmin() {
  console.log('→ Seeding admin account');
  const email = 'admin@sajuwooju.com';
  const passwordHash = await bcrypt.hash('admin123!', 12);

  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      name: 'Platform Admin',
      role: 'super_admin',
      isActive: true,
    },
  });
}

async function seedCategories() {
  console.log('→ Seeding categories');
  for (const category of CATEGORY_DATA) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        description: category.description,
        icon: category.icon,
        color: category.color,
        gradient: category.gradient,
        order: category.order,
        isActive: category.isActive,
      },
      create: category,
    });
  }
}

async function seedProducts() {
  console.log('→ Seeding products');
  for (const product of PRODUCT_DATA) {
    const { categorySlugs, ...productFields } = product;
    await prisma.product.upsert({
      where: { slug: productFields.slug },
      update: {
        ...productFields,
        categories: {
          deleteMany: {},
          create: categorySlugs.map((slug, index) => ({
            order: index,
            category: {
              connect: { slug },
            },
          })),
        },
      },
      create: {
        ...productFields,
        categories: {
          create: categorySlugs.map((slug, index) => ({
            order: index,
            category: {
              connect: { slug },
            },
          })),
        },
      },
    });
  }
}

async function seedUsers() {
  console.log('→ Seeding users');
  type SeedUser = Awaited<ReturnType<typeof prisma.user.upsert>>;
  const users: SeedUser[] = [];

  for (const user of USER_DATA) {
    const { provider, providerAccountId, ...userFields } = user;
    const record = await prisma.user.upsert({
      where: { email: userFields.email.toLowerCase() },
      update: {
        name: userFields.name,
        image: userFields.image,
        role: 'user',
      },
      create: {
        name: userFields.name,
        email: userFields.email.toLowerCase(),
        image: userFields.image,
        role: 'user',
        accounts: {
          create: {
            type: 'oauth',
            provider,
            providerAccountId,
            access_token: `mock-token-${provider}-${Date.now()}`,
            token_type: 'Bearer',
            scope: 'profile email',
          },
        },
      },
    });
    users.push(record);
  }

  return users;
}

async function seedSajuCategories() {
  console.log('→ Seeding saju categories');
  for (const category of SAJU_CATEGORY_DATA) {
    await prisma.sajuCategory.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        icon: category.icon,
        color: category.color,
        gradient: category.gradient,
        description: category.description,
        shortDesc: category.shortDesc,
        order: category.order,
        isActive: category.isActive,
      },
      create: category,
    });
  }
}

async function seedSajuTemplates() {
  console.log('→ Seeding saju templates');
  for (const template of SAJU_TEMPLATE_DATA) {
    const { categorySlug, ...templateFields } = template;

    // Find category ID
    const category = await prisma.sajuCategory.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      console.warn(`⚠️  Category ${categorySlug} not found, skipping template ${template.slug}`);
      continue;
    }

    await prisma.sajuTemplate.upsert({
      where: { slug: templateFields.slug },
      update: {
        ...templateFields,
        layout: templateFields.layout as Prisma.InputJsonValue,
      },
      create: {
        ...templateFields,
        categoryId: category.id,
        layout: templateFields.layout as Prisma.InputJsonValue,
      },
    });
  }
}

async function seedAnalyses(users: { id: string }[]) {
  console.log('→ Seeding sample analyses');
  const analysisData = [
    {
      userIndex: 0,
      category: 'love',
      title: 'Quarterly Love Outlook',
      birthDate: new Date('1990-05-15'),
      birthTime: '14:30',
      gender: 'female',
      yearPillar: 'Gyeong-Ja',
      monthPillar: 'Byeong-O',
      dayPillar: 'Eul-Hae',
      hourPillar: 'Jeong-Si',
      isLunar: false,
      result: {
        summary: 'Positive alignment for collaboration and trust-building throughout Q1.',
        highlights: ['Shared fire elements boost spontaneity', 'Avoid rigid schedules mid-February'],
        recommendations: ['Plan outdoor rituals on odd days', 'Log gratitude prompts nightly'],
      },
      visibility: 'public',
      viewCount: 48,
      likeCount: 12,
      shareCount: 4,
      isPremium: false,
    },
    {
      userIndex: 1,
      category: 'wealth',
      title: 'Capital Timing Briefing',
      birthDate: new Date('1985-11-22'),
      birthTime: '09:15',
      gender: 'male',
      yearPillar: 'Ui-Sa',
      monthPillar: 'Gye-Myo',
      dayPillar: 'Gyeong-In',
      hourPillar: 'Im-Si',
      isLunar: false,
      result: {
        summary: 'Liquidity strain eases after the upcoming wood month.',
        highlights: ['Metal-to-wood clash warns against new leverage before April'],
        recommendations: ['Close legacy receivables', 'Defer equipment purchases until Q3'],
      },
      visibility: 'friends',
      viewCount: 62,
      likeCount: 18,
      shareCount: 7,
      isPremium: true,
    },
    {
      userIndex: 2,
      category: 'career',
      title: 'Leadership Rhythm Forecast',
      birthDate: new Date('1992-03-08'),
      birthTime: '07:40',
      gender: 'female',
      yearPillar: 'Im-Sin',
      monthPillar: 'Mu-In',
      dayPillar: 'Gyeong-Ja',
      hourPillar: 'Gye-Si',
      isLunar: false,
      result: {
        summary: 'Water-heavy pattern rewards documentation and minimal context switching.',
        highlights: ['Peak influence window around early September'],
        recommendations: ['Batch strategic reviews on Mondays', 'Protect two no-meeting afternoons'],
      },
      visibility: 'private',
      viewCount: 21,
      likeCount: 5,
      shareCount: 0,
      isPremium: false,
    },
  ];

  for (const analysis of analysisData) {
    const owner = users[analysis.userIndex];
    if (!owner) {
      continue;
    }

    await prisma.sajuAnalysis.create({
      data: {
        userId: owner.id,
        category: analysis.category,
        title: analysis.title,
        birthDate: analysis.birthDate,
        birthTime: analysis.birthTime,
        isLunar: analysis.isLunar,
        gender: analysis.gender,
        yearPillar: analysis.yearPillar,
        monthPillar: analysis.monthPillar,
        dayPillar: analysis.dayPillar,
        hourPillar: analysis.hourPillar,
        result: analysis.result as Prisma.InputJsonValue,
        visibility: analysis.visibility,
        viewCount: analysis.viewCount,
        likeCount: analysis.likeCount,
        shareCount: analysis.shareCount,
        isPremium: analysis.isPremium,
      },
    });
  }
}

async function main() {
  console.log('🧭 Starting database seed');
  await seedAdmin();
  await seedCategories();
  await seedProducts();
  const users = await seedUsers();
  await seedAnalyses(users);

  // Phase 1.6: Saju Content Template System
  await seedSajuCategories();
  await seedSajuTemplates();

  console.log('✅ Database seed completed');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
