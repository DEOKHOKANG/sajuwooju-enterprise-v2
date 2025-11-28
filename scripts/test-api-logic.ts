import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testAPI() {
  const slug = 'love-fortune';
  console.log(`🧪 Testing API logic for: ${slug}\n`);

  // Simulate API endpoint logic
  const category = await prisma.sajuCategory.findUnique({
    where: { slug, isActive: true },
    include: {
      templates: {
        where: { isActive: true },
        select: { id: true, name: true, slug: true, type: true }
      }
    }
  });

  if (!category) {
    console.log('❌ Category not found');
    return;
  }

  console.log(`✅ Found category: ${category.name}`);
  console.log(`   Templates: ${category.templates.length}`);

  const templateIds = category.templates.map(t => t.id);
  console.log(`   Template IDs:`, templateIds);

  const contents = await prisma.sajuContent.findMany({
    where: {
      templateId: { in: templateIds },
      status: 'published'
    },
    select: {
      id: true,
      title: true,
      slug: true,
      template: { select: { name: true } }
    },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    take: 12
  });

  console.log(`\n📄 Found ${contents.length} published contents:`);
  contents.forEach(c => {
    console.log(`   - ${c.title} (${c.slug})`);
    console.log(`     Template: ${c.template.name}`);
  });

  await prisma.$disconnect();
}

testAPI().catch(console.error);
