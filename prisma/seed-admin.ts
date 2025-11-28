/**
 * Prisma Seed Script - Admin Accounts
 * Phase 7: 초기 관리자 계정 생성
 */

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔐 Starting admin seed...\n');

  // 1. Super Admin 계정 생성
  console.log('👤 Creating Super Admin account...');

  const superAdminPassword = 'Admin123!@#'; // 강력한 임시 비밀번호
  const superAdminHash = await hash(superAdminPassword, 12); // bcrypt rounds: 12

  const superAdmin = await prisma.admin.upsert({
    where: { email: 'admin@sajuwooju.com' },
    update: {
      passwordHash: superAdminHash,
      isActive: true,
    },
    create: {
      email: 'admin@sajuwooju.com',
      passwordHash: superAdminHash,
      name: '시스템 관리자',
      role: 'super_admin',
      isActive: true,
    },
  });

  console.log(`  ✅ Super Admin: ${superAdmin.email}`);
  console.log(`     - ID: ${superAdmin.id}`);
  console.log(`     - Role: ${superAdmin.role}`);
  console.log(`     - Name: ${superAdmin.name}`);

  // 2. Editor 계정 생성
  console.log('\n👤 Creating Editor account...');

  const editorPassword = 'Editor123!@#';
  const editorHash = await hash(editorPassword, 12);

  const editor = await prisma.admin.upsert({
    where: { email: 'editor@sajuwooju.com' },
    update: {
      passwordHash: editorHash,
      isActive: true,
    },
    create: {
      email: 'editor@sajuwooju.com',
      passwordHash: editorHash,
      name: '콘텐츠 편집자',
      role: 'editor',
      isActive: true,
    },
  });

  console.log(`  ✅ Editor: ${editor.email}`);
  console.log(`     - ID: ${editor.id}`);
  console.log(`     - Role: ${editor.role}`);
  console.log(`     - Name: ${editor.name}`);

  // 3. Viewer 계정 생성
  console.log('\n👤 Creating Viewer account...');

  const viewerPassword = 'Viewer123!@#';
  const viewerHash = await hash(viewerPassword, 12);

  const viewer = await prisma.admin.upsert({
    where: { email: 'viewer@sajuwooju.com' },
    update: {
      passwordHash: viewerHash,
      isActive: true,
    },
    create: {
      email: 'viewer@sajuwooju.com',
      passwordHash: viewerHash,
      name: '뷰어',
      role: 'viewer',
      isActive: true,
    },
  });

  console.log(`  ✅ Viewer: ${viewer.email}`);
  console.log(`     - ID: ${viewer.id}`);
  console.log(`     - Role: ${viewer.role}`);
  console.log(`     - Name: ${viewer.name}`);

  // 4. 통계 출력
  const totalAdmins = await prisma.admin.count();

  console.log('\n📊 Admin Seed Summary:');
  console.log(`  • Total Admins: ${totalAdmins}`);
  console.log(`  • Super Admins: 1`);
  console.log(`  • Editors: 1`);
  console.log(`  • Viewers: 1`);

  console.log('\n🔑 Admin Credentials (IMPORTANT - SAVE THIS):');
  console.log('  ┌─────────────────────────────────────────────────────────┐');
  console.log('  │ Super Admin:                                            │');
  console.log('  │   Email:    admin@sajuwooju.com                         │');
  console.log(`  │   Password: ${superAdminPassword}                               │`);
  console.log('  │   Role:     super_admin (Full Access)                   │');
  console.log('  ├─────────────────────────────────────────────────────────┤');
  console.log('  │ Editor:                                                 │');
  console.log('  │   Email:    editor@sajuwooju.com                        │');
  console.log(`  │   Password: ${editorPassword}                              │`);
  console.log('  │   Role:     editor (Read + Write)                       │');
  console.log('  ├─────────────────────────────────────────────────────────┤');
  console.log('  │ Viewer:                                                 │');
  console.log('  │   Email:    viewer@sajuwooju.com                        │');
  console.log(`  │   Password: ${viewerPassword}                              │`);
  console.log('  │   Role:     viewer (Read Only)                          │');
  console.log('  └─────────────────────────────────────────────────────────┘');

  console.log('\n⚠️  SECURITY WARNING:');
  console.log('  • 프로덕션 환경에서는 반드시 비밀번호를 변경하세요!');
  console.log('  • 이 임시 비밀번호는 개발/테스트 용도로만 사용하세요.');
  console.log('  • .env 파일에 ADMIN_JWT_SECRET을 설정하세요.\n');

  console.log('✨ Admin seed completed successfully!\n');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('\n❌ Admin seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
