/**
 * POST /api/saju/analyze-purchase
 * 결제 후 사주 분석 API - 사용자 정보 입력 후 AI 분석
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Lunar, Solar } from 'lunar-javascript';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderId,
      name,
      birthYear,
      birthMonth,
      birthDay,
      birthHour,
      birthMinute,
      gender,
      solarCalendar,
    } = body;

    // 입력 검증
    if (!orderId || !name || !birthYear || !birthMonth || !birthDay || !gender) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: '필수 정보가 누락되었습니다.',
          },
        },
        { status: 400 }
      );
    }

    // 1. 결제 확인
    const payment = await prisma.payment.findUnique({
      where: { orderId },
    });

    if (!payment) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'PAYMENT_NOT_FOUND',
            message: '결제 정보를 찾을 수 없습니다.',
          },
        },
        { status: 404 }
      );
    }

    if (payment.status !== 'done') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'PAYMENT_NOT_COMPLETED',
            message: '결제가 완료되지 않았습니다.',
          },
        },
        { status: 400 }
      );
    }

    // 2. 음력/양력 변환 및 사주 계산
    let birthDate: Date;
    let sajuData: any;

    try {
      // 음력 → 양력 변환
      if (!solarCalendar) {
        const lunar = Lunar.fromYmd(
          parseInt(birthYear),
          parseInt(birthMonth),
          parseInt(birthDay)
        );
        const solar = lunar.getSolar();
        birthDate = new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay());
      } else {
        birthDate = new Date(
          parseInt(birthYear),
          parseInt(birthMonth) - 1,
          parseInt(birthDay)
        );
      }

      // 사주 기본 계산 (천간지지)
      const lunar = Lunar.fromDate(birthDate);
      sajuData = {
        yearPillar: `${lunar.getYearInGanZhi()}`,
        monthPillar: `${lunar.getMonthInGanZhi()}`,
        dayPillar: `${lunar.getDayInGanZhi()}`,
        hourPillar: birthHour ? calculateHourPillar(parseInt(birthHour)) : null,
      };
    } catch (err) {
      console.error('Date conversion error:', err);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_DATE',
            message: '올바른 날짜를 입력해주세요.',
          },
        },
        { status: 400 }
      );
    }

    // 3. OpenAI로 사주 분석
    const apiKey = process.env.OPENAI_API_KEY;
    let analysisResult: string;

    if (!apiKey) {
      // Mock 분석 (개발 모드)
      analysisResult = generateMockAnalysis(name, gender, sajuData);
    } else {
      try {
        const prompt = generateAnalysisPrompt(name, gender, birthDate, sajuData, birthHour);

        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `당신은 30년 경력의 전문 사주명리학자이자 동양철학 박사입니다.
음양오행론, 천간지지, 십성론, 용신론에 정통하며, 전통 명리학의 정수와 현대적 해석을 융합하여 깊이 있고 실용적인 분석을 제공합니다.

**분석 원칙:**
- 사주팔자의 음양오행 균형을 정밀하게 분석
- 천간지지의 상생상극 관계를 깊이 해석
- 십성(十星)의 배치와 작용을 세밀하게 고찰
- 용신(用神)과 희신(喜神)을 파악하여 맞춤형 조언 제공
- 전통 이론에 현대적 실용성을 더한 구체적 가이드 제시
- 긍정적이면서도 현실적인 톤 유지

**전문성:**
- 각 천간지지의 특성과 상호작용을 정확히 해석
- 오행(木火土金水)의 강약과 균형 분석
- 대운(大運)과 세운(歲運)의 흐름 고려
- 개인의 잠재력과 성장 방향 제시`,
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.8,
            max_tokens: 4500,
          }),
        });

        if (!openaiResponse.ok) {
          console.error('OpenAI API Error:', await openaiResponse.text());
          analysisResult = generateMockAnalysis(name, gender, sajuData);
        } else {
          const data = await openaiResponse.json();
          analysisResult =
            data.choices[0]?.message?.content || generateMockAnalysis(name, gender, sajuData);
        }
      } catch (err) {
        console.error('OpenAI request error:', err);
        analysisResult = generateMockAnalysis(name, gender, sajuData);
      }
    }

    // 4. DB에 분석 결과 저장
    const sajuAnalysis = await prisma.sajuAnalysis.create({
      data: {
        userId: payment.userId || 'anonymous',
        category: 'purchase', // 결제 기반 분석
        title: `${name}님의 종합 사주 분석`,
        birthDate,
        birthTime: birthHour && birthMinute ? `${birthHour}:${birthMinute}` : null,
        isLunar: !solarCalendar,
        gender,
        yearPillar: sajuData.yearPillar,
        monthPillar: sajuData.monthPillar,
        dayPillar: sajuData.dayPillar,
        hourPillar: sajuData.hourPillar,
        result: {
          analysis: analysisResult,
          name,
          birthInfo: {
            year: birthYear,
            month: birthMonth,
            day: birthDay,
            hour: birthHour || null,
            minute: birthMinute || null,
            calendar: solarCalendar ? 'solar' : 'lunar',
          },
          sajuPillars: sajuData,
          generatedAt: new Date().toISOString(),
        },
        visibility: 'private',
        isPremium: true, // 결제 기반이므로 프리미엄
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        analysisId: sajuAnalysis.id,
        orderId: payment.orderId,
      },
      message: '사주 분석이 완료되었습니다.',
    });
  } catch (error) {
    console.error('Saju analysis error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '분석 중 오류가 발생했습니다.',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * 시주(시간) 계산 - 간단한 버전
 */
function calculateHourPillar(hour: number): string {
  const hourBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const index = Math.floor((hour + 1) / 2) % 12;
  return hourBranches[index];
}

/**
 * OpenAI 분석 프롬프트 생성
 */
function generateAnalysisPrompt(
  name: string,
  gender: string,
  birthDate: Date,
  sajuData: any,
  birthHour?: string
): string {
  const genderText = gender === 'male' ? '남성' : '여성';
  const hasTime = birthHour !== undefined && birthHour !== '';

  const currentYear = new Date().getFullYear();

  return `
# 종합 사주 분석 의뢰

## 📋 기본 정보
- **성명**: ${name}님
- **성별**: ${genderText}
- **생년월일**: ${birthDate.getFullYear()}년 ${birthDate.getMonth() + 1}월 ${birthDate.getDate()}일
${hasTime ? `- **출생시간**: ${birthHour}시` : '- **출생시간**: 미상 (시주 없이 3주만으로 분석)'}

## 🔮 사주팔자 (四柱八字)
\`\`\`
년주(年柱): ${sajuData.yearPillar}
월주(月柱): ${sajuData.monthPillar}
일주(日柱): ${sajuData.dayPillar}
${sajuData.hourPillar ? `시주(時柱): ${sajuData.hourPillar}` : '시주(時柱): 미상'}
\`\`\`

---

# 분석 요청 사항

위의 사주팔자를 바탕으로 **전문 명리학자의 관점**에서 다음 항목들을 **심층적이고 구체적으로** 분석해주세요:

## 1. 🎭 음양오행 분석 및 타고난 기질 (400자 이상)

**분석 포인트:**
- 사주 내 오행(木火土金水)의 분포와 균형 상태
- 강한 오행과 약한 오행 파악
- 음양의 조화 여부
- 천간지지의 상생상극 관계
- 이러한 오행 배치가 성격과 기질에 미치는 영향
- 타고난 장점과 보완해야 할 점
- 대인관계에서의 특징적 패턴

**요구사항:**
- 단순 성격 나열이 아닌, 사주 구조에서 도출된 근거 제시
- 긍정적 특성과 발전 가능성 강조
- 구체적인 행동 패턴과 사고방식 설명

## 2. ❤️ 연애운·배우자운·인연 분석 (400자 이상)

**분석 포인트:**
- 배우자궁(일지) 분석
- 관성·재성 등 십성의 배치와 배우자 특성
- 연애 스타일과 이상형 (구체적 성향)
- 좋은 인연을 만나기 쉬운 시기 (계절, 나이대)
- 배우자와의 궁합에서 중요한 요소
- 결혼 시기 및 인연 발전 방향
- 연애·결혼 생활에서 주의할 점

**요구사항:**
- 전통 명리학의 배우자운 이론 적용
- 현실적이고 실천 가능한 조언
- 긍정적 관점에서 관계 발전 방향 제시

## 3. 💼 직업운·재물운·사회 성공 분석 (400자 이상)

**분석 포인트:**
- 식상·관성·재성 등 십성 배치로 본 직업 적성
- 적합한 직업군 및 산업 분야 (3가지 이상 구체적 제시)
- 재물을 모으는 방식 (직장, 사업, 투자 등)
- 사업가 기질 vs 직장인 기질
- 사회적 성공 가능성과 출세운
- 재물 증식을 위한 실천 방법
- 투자·재테크 성향 및 주의사항

**요구사항:**
- 현대 직업 환경에 맞는 구체적 직업명 제시
- 사주 구조에 기반한 논리적 설명
- 실질적인 커리어 조언 제공

## 4. 🏃 건강운·생활 관리 (300자 이상)

**분석 포인트:**
- 오행 균형으로 본 건강 취약 부위
- 체질적 특징 (열/냉, 허/실)
- 주의해야 할 질환 및 건강 이슈
- 계절별·시기별 건강 관리 포인트
- 식습관 및 생활습관 조언
- 운동 및 양생법 권장사항

**요구사항:**
- 전통 의학과 명리학의 연결 고리 활용
- 예방 중심의 실천 가능한 조언
- 긍정적 건강 증진 방법 제시

## 5. 📅 ${currentYear}년 연운(年運) 및 대운(大運) 흐름 (350자 이상)

**분석 포인트:**
- ${currentYear}년 세운(歲運)과 사주의 상호작용
- 올해 강화되거나 약화되는 오행
- 중요한 시기 (월별 포인트)
- 기회가 오는 시점과 활용 방법
- 주의가 필요한 시점과 대처법
- 전반적인 운의 흐름 (상승/하강/안정)
- 향후 5년 내 대운의 변화 방향

**요구사항:**
- 현재 시점과 연계된 구체적 조언
- 실천 가능한 타이밍 전략 제시
- 장기적 관점의 운세 흐름 설명

## 6. ⭐ 용신(用神) 및 맞춤형 개운 방향 (350자 이상)

**분석 포인트:**
- 사주의 용신(用神)과 희신(喜神) 파악
- 부족한 오행을 보완하는 방법
- 길한 방위·색상·숫자 제시
- 인생의 큰 방향성과 목표 설정
- 현실적이고 실천 가능한 개선 전략
- 자기계발 및 성장 포인트
- 긍정적 마인드셋 유지 방법

**요구사항:**
- 전통 명리학의 용신론 적용
- 현대 생활에서 실천 가능한 구체적 방법
- 희망적이고 동기부여가 되는 메시지

---

# 📝 작성 가이드라인

**형식:**
- 마크다운 형식으로 작성
- 각 섹션은 \`## 🎭\` 형태의 헤더로 구분
- 이모지를 적절히 활용하여 가독성 향상
- 중요한 키워드는 **볼드** 처리

**톤앤매너:**
- 전문적이면서도 따뜻한 어조
- 긍정적이고 희망적인 메시지 전달
- 단정적 표현보다는 가능성과 방향성 제시
- 겸손하되 확신 있는 조언

**내용 깊이:**
- 각 섹션별 최소 글자 수 준수
- 피상적 설명이 아닌 사주 구조 기반 논리적 분석
- 구체적 예시와 실천 방법 포함
- 전통 이론과 현대적 해석의 조화

**금기사항:**
- 지나치게 부정적이거나 불안을 조성하는 표현 지양
- 근거 없는 단언이나 과장 금지
- 추상적이고 모호한 표현 지양
- 일반론이 아닌 개인 사주에 특화된 분석 제공

---

**위 가이드라인에 따라 ${name}님만을 위한 전문적이고 심층적인 사주 분석을 작성해주세요.**
`;
}

/**
 * Mock 분석 생성 (개발/테스트용)
 */
function generateMockAnalysis(name: string, gender: string, sajuData: any): string {
  const genderText = gender === 'male' ? '남성' : '여성';
  const currentYear = new Date().getFullYear();

  return `# ${name}님의 종합 사주 분석 결과

${name}님(${genderText})의 사주를 분석한 결과, 전반적으로 균형잡힌 운세를 보이고 계십니다.

## 🎨 사주팔자

- **년주(年柱)**: ${sajuData.yearPillar}
- **월주(月柱)**: ${sajuData.monthPillar}
- **일주(日柱)**: ${sajuData.dayPillar}
${sajuData.hourPillar ? `- **시주(時柱)**: ${sajuData.hourPillar}` : ''}

---

## 🌟 기본 성격 및 성향

${name}님은 타고난 리더십과 책임감을 갖춘 분입니다. 일에 있어서는 완벽주의 성향이 강하며, 한 번 시작한 일은 끝까지 해내는 끈기와 인내심이 있습니다.

대인관계에서는 진정성 있는 태도로 사람들의 신뢰를 얻으며, 특히 어려운 상황에 처한 사람들을 돕는 것에서 보람을 느낍니다. 다만, 때로는 자신의 감정을 표현하는 것을 어려워할 수 있으니, 가까운 사람들과의 소통에 더 마음을 열어보시기 바랍니다.

---

## 💕 연애운 및 인연

연애에 있어서 ${name}님은 진지하고 깊이 있는 관계를 선호하는 스타일입니다. 첫눈에 반하기보다는 시간을 두고 천천히 상대방을 알아가는 과정을 중요하게 여깁니다.

이상형은 내면의 깊이가 있으며 대화가 통하는 사람입니다. 특히 같은 가치관을 공유하고 서로의 꿈을 응원해줄 수 있는 파트너를 만나면 행복한 관계를 유지할 수 있습니다.

좋은 인연은 주로 봄과 가을에 찾아올 가능성이 높으며, 친구나 지인의 소개를 통해 만날 확률이 높습니다. 관계에서는 솔직한 소통이 가장 중요하니, 감정을 숨기지 말고 표현하는 연습을 하시기 바랍니다.

---

## 💼 직업운 및 재물운

${name}님은 전문성을 발휘할 수 있는 분야에서 두각을 나타낼 사주입니다. 특히 교육, 상담, 컨설팅, 연구 등 사람들에게 도움을 주거나 지식을 나누는 직업이 잘 맞습니다.

재물운은 꾸준하고 안정적인 편입니다. 갑자기 큰 돈을 벌기보다는 성실한 노력으로 차근차근 재산을 모아가는 타입이십니다. 투자에 있어서는 신중한 접근이 필요하며, 장기적인 관점에서 안정적인 투자처를 선택하는 것이 좋습니다.

사업을 한다면 파트너와 함께하는 것이 유리하며, 혼자보다는 팀워크를 발휘할 수 있는 환경에서 더 큰 성과를 낼 수 있습니다.

---

## 🏥 건강운

전반적으로 건강한 편이나, 스트레스 관리에 신경 써야 합니다. 특히 소화기 계통과 호흡기 건강을 주의하시고, 규칙적인 운동과 충분한 휴식을 취하는 것이 중요합니다.

계절이 바뀔 때 컨디션 관리를 잘하시고, 과로를 피하시기 바랍니다. 명상이나 요가 같은 심신 안정에 도움이 되는 활동을 추천드립니다.

---

## 📅 ${currentYear}년 올해의 운세

${currentYear}년은 ${name}님에게 변화와 성장의 해입니다. 상반기에는 새로운 기회들이 찾아오며, 특히 3월과 6월에 중요한 전환점을 맞이할 수 있습니다.

하반기에는 그동안의 노력이 결실을 맺는 시기로, 9월부터 12월까지는 좋은 소식들이 이어질 것입니다. 다만, 7월과 10월에는 신중한 판단이 필요한 시기이니 중요한 결정은 충분히 고민한 후 내리시기 바랍니다.

전반적으로 긍정적인 흐름이 예상되니, 자신감을 갖고 도전하시되 무리하지 않는 선에서 진행하시면 좋은 결과를 얻으실 수 있습니다.

---

## 💡 조언 및 개선 방향

${name}님의 가장 큰 강점은 성실함과 책임감입니다. 이를 바탕으로 꾸준히 노력한다면 원하는 목표를 반드시 달성하실 수 있습니다.

다만, 때로는 완벽을 추구하다가 스스로를 너무 몰아붙이는 경향이 있으니, 작은 성공들을 축하하고 자신에게 관대해지는 연습이 필요합니다. 완벽하지 않아도 괜찮다는 마음가짐으로 여유를 갖고 살아가시기 바랍니다.

대인관계에서는 자신의 감정을 솔직하게 표현하는 것을 두려워하지 마세요. 진정성 있는 소통이 더욱 깊고 의미 있는 관계를 만들어줄 것입니다.

---

## ✨ 마무리

${name}님은 타고난 잠재력과 능력을 충분히 갖추고 계십니다. 자신을 믿고 꾸준히 노력한다면, 원하는 삶을 살아갈 수 있습니다.

어려움이 찾아와도 이는 성장의 기회이며, ${name}님은 충분히 극복할 수 있는 힘을 가지고 계십니다. 긍정적인 마음가짐으로 하루하루를 소중히 여기며 살아가시기 바랍니다.

행복한 미래를 응원합니다! 🌈

---

*본 분석은 전통 사주명리학을 기반으로 작성되었습니다.*
*개발 모드로 실행되었습니다. 실제 환경에서는 AI 기반 상세 분석이 제공됩니다.*
`;
}
