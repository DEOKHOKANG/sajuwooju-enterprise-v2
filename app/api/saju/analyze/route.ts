/**
 * 사주 분석 API Route (상용화급)
 * POST /api/saju/analyze
 */

import { NextRequest, NextResponse } from "next/server";
import { getFortunePrompt } from "@/lib/prompts";
import type { FortuneCategory } from "@/lib/prompts";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      category,
      name,
      gender,
      calendarType,
      year,
      month,
      day,
      birthHour,
      sajuGanZhi,
      sajuString,
    } = body;

    // 입력 검증
    if (!category || !name || !gender || !year || !month || !day || !birthHour) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    // OpenAI API 키 확인
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // API 키가 없을 경우 Mock 응답 반환 (개발용)
      return NextResponse.json({
        result: generateMockResult(category, name, sajuString),
        timestamp: new Date().toISOString(),
      });
    }

    // 프롬프트 생성
    const prompt = getFortunePrompt(category as FortuneCategory, {
      name,
      gender,
      calendarType,
      year,
      month,
      day,
      birthHour,
      sajuGanZhi,
      sajuString,
    });

    // OpenAI API 호출
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "당신은 전문 사주명리학자입니다. 정확하고 깊이 있는 분석을 제공합니다.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error("OpenAI API Error:", errorData);

      // Fallback to mock result
      return NextResponse.json({
        result: generateMockResult(category, name, sajuString),
        timestamp: new Date().toISOString(),
      });
    }

    const data = await openaiResponse.json();
    const result = data.choices[0]?.message?.content || "분석 결과를 생성할 수 없습니다.";

    return NextResponse.json({
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Saju analysis error:", error);
    return NextResponse.json(
      { error: "분석 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/**
 * Mock 결과 생성 (개발/테스트용)
 */
function generateMockResult(category: string, name: string, sajuString: string): string {
  const categoryTitles: { [key: string]: string } = {
    love: "연애운",
    wealth: "재물운",
    career: "직업운",
    compatibility: "궁합",
    yearly: "연운",
    comprehensive: "종합운세",
  };

  const title = categoryTitles[category] || "사주 분석";

  return `# ${name}님의 ${title} 분석 결과

## 📊 사주팔자
${sajuString}

## 🔮 전체 운세
${name}님의 사주를 분석한 결과, 전반적으로 균형잡힌 오행 구조를 가지고 계십니다.

### ✨ 주요 특징
- **타고난 기질**: 성실하고 끈기있는 성격으로 목표를 향해 꾸준히 나아가는 스타일입니다.
- **대인관계**: 주변 사람들과의 조화를 중시하며, 신뢰를 쌓는 데 능숙합니다.
- **재물운**: 꾸준한 노력으로 재물을 축적하는 유형입니다.

### 💡 조언
1. 현재의 방향을 유지하되, 때로는 과감한 도전도 필요합니다.
2. 건강 관리에 신경 쓰세요.
3. 주변 사람들과의 관계를 소중히 여기세요.

### 🎯 이 시기의 포인트
${getCurrentPeriodAdvice(category)}

---

*본 분석은 전통 사주명리학을 기반으로 작성되었습니다.*
`;
}

function getCurrentPeriodAdvice(category: string): string {
  const advices: { [key: string]: string } = {
    love: "새로운 만남의 기회가 찾아올 수 있는 시기입니다. 열린 마음으로 사람들을 대하세요.",
    wealth: "재물운이 상승하는 시기입니다. 투자나 새로운 사업 기회를 고려해보세요.",
    career: "커리어 발전의 기회가 있습니다. 적극적으로 자신을 어필하세요.",
    compatibility: "상대방과의 조화를 이루기 위해 서로를 이해하려는 노력이 필요합니다.",
    yearly: "올해는 변화와 발전의 해입니다. 계획을 세우고 실행에 옮기세요.",
    comprehensive: "전반적으로 안정적인 운세입니다. 현재의 기반을 다지는 시기로 활용하세요.",
  };

  return advices[category] || "긍정적인 마음가짐으로 하루하루를 살아가세요.";
}

// OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
