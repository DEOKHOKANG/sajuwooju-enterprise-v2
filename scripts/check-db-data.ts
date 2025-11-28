/**
 * Check Production Database Data
 * Verify that seed data exists in production
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  console.log('🔍 Checking production database data...\n');

  try {
    // Check categories
    const categories = await prisma.sajuCategory.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
        order: true,
      },
      orderBy: { order: 'asc' },
    });

    console.log(`📁 Categories: ${categories.length}`);
    categories.forEach((cat) => {
      console.log(`   - ${cat.name} (${cat.slug}) [active: ${cat.isActive}, order: ${cat.order}]`);
    });

    // Check templates
    const templates = await prisma.sajuTemplate.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        categoryId: true,
        isActive: true,
      },
    });

    console.log(`\n📝 Templates: ${templates.length}`);
    templates.forEach((tmpl) => {
      console.log(`   - ${tmpl.name} (${tmpl.slug}) [active: ${tmpl.isActive}]`);
    });

    // Check contents
    const contents = await prisma.sajuContent.findMany({
      where: { status: 'published' },
      select: {
        id: true,
        title: true,
        slug: true,
        templateId: true,
        status: true,
      },
    });

    console.log(`\n📄 Published Contents: ${contents.length}`);
    contents.forEach((cont) => {
      console.log(`   - ${cont.title} (${cont.slug}) [status: ${cont.status}]`);
    });

    console.log('\n✅ Database check complete!');
  } catch (error) {
    console.error('❌ Error checking database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
checkData()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed:', error);
    process.exit(1);
  });
