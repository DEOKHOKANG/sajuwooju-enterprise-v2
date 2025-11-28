/**
 * 재물운 프롬프트 템플릿
 * Element: 金 (Metal)
 */

export interface WealthFortuneInput {
  name: string;
  birthDate: string;
  birthTime: string;
  gender: "male" | "female";
  isLunar: boolean;
}

export interface WealthFortuneResult {
  overall: string;
  yearlyFlow: string;
  incomeOpportunities: string;
  investmentAdvice: string;
  cautions: string[];
  luckyMethods: string[];
  score: number;
}

export function generateWealthFortunePrompt(input: WealthFortuneInput): string {
  return `
당신은 30년 경력의 전문 사주 명리학자입니다.
다음 정보를 바탕으로 재물운을 분석해주세요:

사용자 정보:
- 이름: ${input.name}
- 생년월일: ${input.birthDate} (${input.isLunar ? "음력" : "양력"})
- 출생시간: ${input.birthTime}
- 성별: ${input.gender === "male" ? "남성" : "여성"}

분석 영역: 재물운 (金 기운)

다음 항목을 포함하여 분석해주세요:
1. 전반적인 재물운 (overall, 2-3문장)
2. 올해의 재물 흐름 (yearlyFlow, 3-4문장)
3. 수입 기회 및 재물 증가 가능성 (incomeOpportunities, 2-3문장)
4. 투자 및 재테크 조언 (investmentAdvice, 2-3문장)
5. 주의사항 (cautions, 2-3개 배열)
6. 재물을 부르는 방법 (luckyMethods, 2개 배열)
7. 재물운 점수 (score, 1-100)

응답 형식: JSON
{
  "overall": "...",
  "yearlyFlow": "...",
  "incomeOpportunities": "...",
  "investmentAdvice": "...",
  "cautions": ["...", "..."],
  "luckyMethods": ["...", "..."],
  "score": 75
}

중요:
- 실용적이고 구체적인 재테크 조언
- 음양오행 이론 기반 해석
- 긍정적이면서도 신중한 톤
`;
}
