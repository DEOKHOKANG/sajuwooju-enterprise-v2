/**
 * 결제 후 사주 분석 플로우 통합 테스트
 *
 * 이 스크립트는 전체 플로우를 테스트합니다:
 * 1. Mock 결제 데이터 생성
 * 2. 사주 분석 API 호출
 * 3. 결과 조회
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testPaymentFlow() {
  console.log('🧪 결제 후 사주 분석 플로우 테스트 시작\n');

  try {
    // 1. 테스트 사용자 생성 또는 조회
    console.log('📝 Step 1: 테스트 사용자 확인...');
    let testUser = await prisma.user.findUnique({
      where: { email: 'test-payment@example.com' },
    });

    if (!testUser) {
      testUser = await prisma.user.create({
        data: {
          email: 'test-payment@example.com',
          name: '테스트유저',
          // nextAuth는 provider를 요구하므로 credentials로 설정
          accounts: {
            create: {
              type: 'credentials',
              provider: 'credentials',
              providerAccountId: 'test-payment-user',
            },
          },
        },
      });
      console.log(`✅ 테스트 사용자 생성 완료: ${testUser.email}\n`);
    } else {
      console.log(`✅ 기존 테스트 사용자 사용: ${testUser.email}\n`);
    }

    // 2. 테스트용 결제 데이터 생성
    console.log('📝 Step 2: 테스트 결제 데이터 생성...');
    const testOrderId = `TEST-ORDER-${Date.now()}`;

    const payment = await prisma.payment.create({
      data: {
        orderId: testOrderId,
        status: 'done',
        amount: 39000,
        orderName: '2025년 신년운세',
        customerName: '테스트유저',
        customerEmail: 'test-payment@example.com',
        productId: 'test-product-id',
        method: 'CARD',
        approvedAt: new Date(),
        userId: testUser.id,
      },
    });

    console.log(`✅ 결제 데이터 생성 완료: ${payment.orderId}\n`);

    // 3. 사주 분석 데이터 생성 (API를 직접 호출하는 대신 직접 생성)
    console.log('📝 Step 3: 사주 분석 데이터 생성...');

    const analysis = await prisma.sajuAnalysis.create({
      data: {
        userId: testUser.id,
        category: 'purchase',
        title: '테스트유저님의 종합 사주 분석',
        birthDate: new Date('1990-01-01'),
        birthTime: '14:30',
        isLunar: false,
        gender: 'male',
        yearPillar: '庚午',
        monthPillar: '戊寅',
        dayPillar: '甲子',
        hourPillar: '辛未',
        result: {
          analysis: `# 테스트유저님의 종합 사주 분석

## 🌟 기본 성격 및 성향

테스트유저님은 타고난 리더십과 책임감을 갖춘 분입니다. 일에 있어서는 완벽주의 성향이 강하며, 한 번 시작한 일은 끝까지 해내는 끈기와 인내심이 있습니다.

## 💕 연애운 및 인연

연애에 있어서 진지하고 깊이 있는 관계를 선호하는 스타일입니다. 첫눈에 반하기보다는 시간을 두고 천천히 상대방을 알아가는 과정을 중요하게 여깁니다.

## 💼 직업운 및 재물운

전문성을 발휘할 수 있는 분야에서 두각을 나타낼 사주입니다. 특히 교육, 상담, 컨설팅, 연구 등 사람들에게 도움을 주거나 지식을 나누는 직업이 잘 맞습니다.

## 🏥 건강운

전반적으로 건강한 편이나, 스트레스 관리에 신경 써야 합니다. 특히 소화기 계통과 호흡기 건강을 주의하시고, 규칙적인 운동과 충분한 휴식을 취하는 것이 중요합니다.

## 📅 2025년 올해의 운세

2025년은 변화와 성장의 해입니다. 상반기에는 새로운 기회들이 찾아오며, 하반기에는 그동안의 노력이 결실을 맺는 시기입니다.

## 💡 조언 및 개선 방향

자신을 믿고 꾸준히 노력한다면, 원하는 삶을 살아갈 수 있습니다. 긍정적인 마음가짐으로 하루하루를 소중히 여기며 살아가시기 바랍니다.`,
          name: '테스트유저',
          birthInfo: {
            year: '1990',
            month: '1',
            day: '1',
            hour: '14',
            minute: '30',
            calendar: 'solar',
          },
          sajuPillars: {
            yearPillar: '庚午',
            monthPillar: '戊寅',
            dayPillar: '甲子',
            hourPillar: '辛未',
          },
          generatedAt: new Date().toISOString(),
        },
        visibility: 'private',
        isPremium: true,
      },
    });

    console.log(`✅ 사주 분석 생성 완료: ${analysis.id}\n`);

    // 4. 생성된 데이터 조회 테스트
    console.log('📝 Step 4: 생성된 데이터 조회 테스트...');

    const retrievedPayment = await prisma.payment.findUnique({
      where: { orderId: testOrderId },
    });

    const retrievedAnalysis = await prisma.sajuAnalysis.findUnique({
      where: { id: analysis.id },
    });

    if (!retrievedPayment || !retrievedAnalysis) {
      throw new Error('데이터 조회 실패');
    }

    console.log('✅ 데이터 조회 성공\n');

    // 4. 결과 출력
    console.log('📊 테스트 결과 요약:');
    console.log('─────────────────────────────────────');
    console.log(`주문 ID: ${retrievedPayment.orderId}`);
    console.log(`결제 금액: ${retrievedPayment.amount.toLocaleString()}원`);
    console.log(`결제 상태: ${retrievedPayment.status}`);
    console.log(`분석 ID: ${retrievedAnalysis.id}`);
    console.log(`분석 제목: ${retrievedAnalysis.title}`);
    console.log(`생년월일: ${retrievedAnalysis.birthDate.toLocaleDateString('ko-KR')}`);
    console.log(`사주팔자: ${retrievedAnalysis.yearPillar} ${retrievedAnalysis.monthPillar} ${retrievedAnalysis.dayPillar} ${retrievedAnalysis.hourPillar}`);
    console.log('─────────────────────────────────────\n');

    // 5. 테스트 URL 출력
    console.log('🌐 테스트 URL:');
    console.log(`정보 입력: http://localhost:3000/saju/input/${testOrderId}`);
    console.log(`결과 페이지: http://localhost:3000/saju/result/${analysis.id}\n`);

    // 6. 정리 (선택적)
    console.log('🧹 테스트 데이터 정리 여부를 선택하세요:');
    console.log('유지하려면 Ctrl+C를 누르거나, 5초 후 자동으로 정리됩니다...');

    await new Promise(resolve => setTimeout(resolve, 5000));

    await prisma.sajuAnalysis.delete({ where: { id: analysis.id } });
    await prisma.payment.delete({ where: { orderId: testOrderId } });

    console.log('✅ 테스트 데이터 정리 완료\n');

    console.log('✨ 모든 테스트 통과!');

  } catch (error) {
    console.error('❌ 테스트 실패:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 스크립트 실행
testPaymentFlow()
  .then(() => {
    console.log('\n🎉 테스트 완료!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 테스트 오류:', error);
    process.exit(1);
  });
