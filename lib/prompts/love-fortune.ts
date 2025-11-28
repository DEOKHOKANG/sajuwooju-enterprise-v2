/**
 * 연애운 프롬프트 템플릿
 * Element: 火 (Fire)
 */

export interface LoveFortuneInput {
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:MM
  gender: "male" | "female";
  isLunar: boolean;
}

export interface LoveFortuneResult {
  overall: string; // 전반적인 연애운 요약 (2-3문장)
  yearlyFlow: string; // 올해의 연애 흐름 (3-4문장)
  meetingPossibility: string; // 만남 가능성과 시기 (2-3문장)
  cautions: string[]; // 주의사항 (2-3개)
  advice: string[]; // 조언 (3개)
  luckyMethods: string[]; // 행운의 방법 (2개)
  score: number; // 1-100점
}

export function generateLoveFortunePrompt(input: LoveFortuneInput): string {
  return `
당신은 30년 경력의 전문 사주 명리학자입니다.
다음 정보를 바탕으로 연애운을 분석해주세요:

사용자 정보:
- 이름: ${input.name}
- 생년월일: ${input.birthDate} (${input.isLunar ? "음력" : "양력"})
- 출생시간: ${input.birthTime}
- 성별: ${input.gender === "male" ? "남성" : "여성"}

분석 영역: 연애운 (火 기운)

다음 항목을 포함하여 분석해주세요:
1. 전반적인 연애 운세 (overall)
2. 올해의 연애 흐름 (yearlyFlow)
3. 만남의 가능성과 시기 (meetingPossibility)
4. 주의할 점 (cautions, 2-3개 배열)
5. 조언 및 행동 지침 (advice, 3개 배열)
6. 행운의 방법 (luckyMethods, 2개 배열)
7. 연애운 점수 (score, 1-100)

응답 형식: JSON
{
  "overall": "전반적인 연애운 요약 (2-3문장)",
  "yearlyFlow": "올해의 흐름 (3-4문장)",
  "meetingPossibility": "만남 가능성 (2-3문장)",
  "cautions": ["주의사항1", "주의사항2"],
  "advice": ["조언1", "조언2", "조언3"],
  "luckyMethods": ["행운의 방법1", "방법2"],
  "score": 75
}

중요:
- 친근하고 따뜻한 톤으로 작성
- 구체적이고 실용적인 조언 제공
- 희망적인 메시지 포함
- 음양오행과 천간지지 이론에 기반한 해석
`;
}
