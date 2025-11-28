/**
 * 사주 분석 프롬프트 템플릿 통합 파일
 * 6가지 카테고리: 연애운, 재물운, 직업운, 궁합, 연운, 종합분석
 */

// 공통 입력 인터페이스
export interface SajuInput {
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:MM
  gender: "male" | "female";
  isLunar: boolean;
}

// 직업운 (木 - Wood)
export interface CareerFortuneResult {
  overall: string;
  yearlyFlow: string;
  careerOpportunities: string;
  jobChangeAdvice: string;
  cautions: string[];
  luckyMethods: string[];
  score: number;
}

export function generateCareerFortunePrompt(input: SajuInput): string {
  return `
당신은 30년 경력의 전문 사주 명리학자입니다.
다음 정보를 바탕으로 직업운을 분석해주세요:

사용자 정보:
- 이름: ${input.name}
- 생년월일: ${input.birthDate} (${input.isLunar ? "음력" : "양력"})
- 출생시간: ${input.birthTime}
- 성별: ${input.gender === "male" ? "남성" : "여성"}

분석 영역: 직업운 (木 기운)

다음 항목을 JSON으로 응답해주세요:
{
  "overall": "전반적인 직업운 요약 (2-3문장)",
  "yearlyFlow": "올해의 직장 흐름 (3-4문장)",
  "careerOpportunities": "승진/이직 기회 (2-3문장)",
  "jobChangeAdvice": "이직 타이밍 조언 (2-3문장)",
  "cautions": ["주의사항1", "주의사항2"],
  "luckyMethods": ["성공 방법1", "방법2"],
  "score": 75
}
`;
}

// 궁합 (水 - Water)
export interface CompatibilityInput {
  person1: SajuInput;
  person2: SajuInput;
}

export interface CompatibilityResult {
  overall: string;
  loveCompatibility: string;
  personalityMatch: string;
  conflictAreas: string[];
  strengths: string[];
  advice: string[];
  score: number;
}

export function generateCompatibilityPrompt(input: CompatibilityInput): string {
  return `
당신은 30년 경력의 전문 사주 명리학자입니다.
두 사람의 궁합을 분석해주세요:

사람 1:
- 이름: ${input.person1.name}
- 생년월일: ${input.person1.birthDate} (${input.person1.isLunar ? "음력" : "양력"})
- 출생시간: ${input.person1.birthTime}
- 성별: ${input.person1.gender === "male" ? "남성" : "여성"}

사람 2:
- 이름: ${input.person2.name}
- 생년월일: ${input.person2.birthDate} (${input.person2.isLunar ? "음력" : "양력"})
- 출생시간: ${input.person2.birthTime}
- 성별: ${input.person2.gender === "male" ? "남성" : "여성"}

분석 영역: 궁합 (水 기운)

다음 항목을 JSON으로 응답해주세요:
{
  "overall": "전반적인 궁합 요약 (2-3문장)",
  "loveCompatibility": "연애 궁합 (3-4문장)",
  "personalityMatch": "성격 조화도 (2-3문장)",
  "conflictAreas": ["충돌 가능 영역1", "영역2"],
  "strengths": ["강점1", "강점2", "강점3"],
  "advice": ["관계 조언1", "조언2", "조언3"],
  "score": 85
}
`;
}

// 연운 (土 - Earth)
export interface YearlyFortuneResult {
  overall: string;
  monthlyOverview: string;
  keyEvents: string[];
  luckyMonths: string[];
  cautiousMonths: string[];
  advice: string[];
  score: number;
}

export function generateYearlyFortunePrompt(input: SajuInput): string {
  const currentYear = new Date().getFullYear();

  return `
당신은 30년 경력의 전문 사주 명리학자입니다.
${currentYear}년 연운을 분석해주세요:

사용자 정보:
- 이름: ${input.name}
- 생년월일: ${input.birthDate} (${input.isLunar ? "음력" : "양력"})
- 출생시간: ${input.birthTime}
- 성별: ${input.gender === "male" ? "남성" : "여성"}

분석 영역: ${currentYear}년 연운 (土 기운)

다음 항목을 JSON으로 응답해주세요:
{
  "overall": "${currentYear}년 전체 운세 요약 (3-4문장)",
  "monthlyOverview": "월별 흐름 개괄 (3-4문장)",
  "keyEvents": ["주요 사건/기회1", "사건2", "사건3"],
  "luckyMonths": ["행운의 달1", "달2"],
  "cautiousMonths": ["주의할 달1", "달2"],
  "advice": ["올해의 조언1", "조언2", "조언3"],
  "score": 75
}
`;
}

// 종합분석 (五行 - All Elements)
export interface ComprehensiveResult {
  overall: string;
  strengths: string[];
  weaknesses: string[];
  lifeDirection: string;
  loveLife: string;
  career: string;
  wealth: string;
  health: string;
  relationships: string;
  advice: string[];
  score: number;
}

export function generateComprehensivePrompt(input: SajuInput): string {
  return `
당신은 30년 경력의 전문 사주 명리학자입니다.
전체 사주를 종합적으로 분석해주세요:

사용자 정보:
- 이름: ${input.name}
- 생년월일: ${input.birthDate} (${input.isLunar ? "음력" : "양력"})
- 출생시간: ${input.birthTime}
- 성별: ${input.gender === "male" ? "남성" : "여성"}

분석 영역: 종합분석 (五行 전체)

다음 항목을 JSON으로 응답해주세요:
{
  "overall": "전체 사주 요약 (4-5문장)",
  "strengths": ["장점1", "장점2", "장점3"],
  "weaknesses": ["약점1", "약점2"],
  "lifeDirection": "인생 방향성 (3-4문장)",
  "loveLife": "연애/결혼 운세 (2-3문장)",
  "career": "직업/사업 운세 (2-3문장)",
  "wealth": "재물 운세 (2-3문장)",
  "health": "건강 운세 (2-3문장)",
  "relationships": "대인관계 운세 (2-3문장)",
  "advice": ["인생 조언1", "조언2", "조언3", "조언4"],
  "score": 80
}
`;
}

// 프롬프트 타입 매핑
export type FortuneCategory =
  | "love"
  | "wealth"
  | "career"
  | "compatibility"
  | "yearly"
  | "comprehensive";

// 카테고리별 프롬프트 생성 함수 매핑
export const PROMPT_GENERATORS = {
  love: (input: SajuInput) => {
    const { generateLoveFortunePrompt } = require("./love-fortune");
    return generateLoveFortunePrompt(input);
  },
  wealth: (input: SajuInput) => {
    const { generateWealthFortunePrompt } = require("./wealth-fortune");
    return generateWealthFortunePrompt(input);
  },
  career: generateCareerFortunePrompt,
  compatibility: generateCompatibilityPrompt,
  yearly: generateYearlyFortunePrompt,
  comprehensive: generateComprehensivePrompt,
};

/**
 * 카테고리에 맞는 프롬프트 생성 (상용화급)
 */
export function getFortunePrompt(category: FortuneCategory, input: any): string {
  const {
    name,
    gender,
    calendarType,
    year,
    month,
    day,
    birthHour,
    sajuString,
  } = input;

  const basePrompt = `
당신은 30년 경력의 전문 사주명리학자입니다.
다음 사용자의 사주를 분석하여 ${getCategoryName(category)} 결과를 제공해주세요.

## 사용자 정보
- 이름: ${name}
- 성별: ${gender === "male" ? "남성" : "여성"}
- 생년월일: ${year}년 ${month}월 ${day}일 (${calendarType === "solar" ? "양력" : "음력"})
- 출생시간: ${birthHour}

## 사주팔자
${sajuString}

## 분석 요청사항
${getCategoryInstructions(category)}

분석 결과는 마크다운 형식으로 작성하되, 다음 구조를 따라주세요:
1. 전반적인 운세 요약
2. 구체적인 분석 (3-4개 항목)
3. 주의사항 및 조언
4. 행운의 방법

전문적이면서도 따뜻하고 희망적인 톤으로 작성해주세요.
`;

  return basePrompt;
}

function getCategoryName(category: FortuneCategory): string {
  const names: { [key: string]: string } = {
    love: "연애운",
    wealth: "재물운",
    career: "직업운",
    compatibility: "궁합",
    yearly: "연운",
    comprehensive: "종합운세",
  };
  return names[category] || "사주 분석";
}

function getCategoryInstructions(category: FortuneCategory): string {
  const instructions: { [key: string]: string } = {
    love: "연애운과 관련하여 만남의 가능성, 연애 운의 흐름, 이상형, 주의사항을 분석해주세요.",
    wealth: "재물운과 관련하여 수입의 흐름, 투자 운, 재테크 방법, 주의사항을 분석해주세요.",
    career: "직업운과 관련하여 커리어 발전, 이직 시기, 적성, 성공 방법을 분석해주세요.",
    compatibility: "궁합과 관련하여 상대방과의 조화, 장단점, 관계 발전 방향을 분석해주세요.",
    yearly: "올해의 운세와 관련하여 월별 흐름, 중요한 시기, 기회와 위험 요소를 분석해주세요.",
    comprehensive: "종합운세와 관련하여 전반적인 기질, 강점과 약점, 인생 방향, 성공 전략을 분석해주세요.",
  };
  return instructions[category] || "사주를 종합적으로 분석해주세요.";
}
