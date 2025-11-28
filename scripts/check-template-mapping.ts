import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkMapping() {
  console.log('🔗 Checking template-category mapping...\n');
  
  const categories = await prisma.sajuCategory.findMany({
    where: { isActive: true },
    include: {
      templates: {
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          slug: true,
          _count: {
            select: { contents: { where: { status: 'published' } } }
          }
        }
      }
    },
    orderBy: { order: 'asc' }
  });

  categories.forEach(cat => {
    console.log(`📁 ${cat.name} (${cat.slug})`);
    console.log(`   Templates: ${cat.templates.length}`);
    cat.templates.forEach(tmpl => {
      console.log(`   - ${tmpl.name} (${tmpl.slug}): ${tmpl._count.contents} contents`);
    });
    console.log('');
  });

  await prisma.$disconnect();
}

checkMapping().catch(console.error);
