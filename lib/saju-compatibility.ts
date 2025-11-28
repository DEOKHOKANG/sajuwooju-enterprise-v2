/**
 * 사주 궁합 알고리즘 (Production Grade)
 * 음양오행 이론 기반 정교한 궁합 계산
 */

export type Element = "木" | "火" | "土" | "金" | "水";
export type MatchType = "연애궁합" | "학업궁합" | "사업궁합" | "결혼궁합";

interface SajuProfile {
  name: string;
  birthYear: number;
  zodiac: string;
  dominantElement: Element;
  subElement?: Element;
}

interface CompatibilityResult {
  overall: number; // 0-100
  breakdown: {
    elementHarmony: number;
    zodiacHarmony: number;
    personalityMatch: number;
    energyBalance: number;
  };
  strengths: string[];
  challenges: string[];
  advice: string[];
  luckyActivities: string[];
}

/**
 * 오행 상생상극 관계
 * 상생(相生): 木生火 火生土 土生金 金生水 水生木
 * 상극(相剋): 木剋土 土剋水 水剋火 火剋金 金剋木
 */
const ELEMENT_RELATIONS = {
  木: { generates: "火", controls: "土", generatedBy: "水", controlledBy: "金" },
  火: { generates: "土", controls: "金", generatedBy: "木", controlledBy: "水" },
  土: { generates: "金", controls: "水", generatedBy: "火", controlledBy: "木" },
  金: { generates: "水", controls: "木", generatedBy: "土", controlledBy: "火" },
  水: { generates: "木", controls: "火", generatedBy: "金", controlledBy: "土" },
};

/**
 * 띠별 궁합 관계 (12지지)
 */
const ZODIAC_COMPATIBILITY: Record<string, { excellent: string[]; good: string[]; caution: string[] }> = {
  "쥐띠": { excellent: ["용띠", "원숭이띠"], good: ["소띠", "돼지띠"], caution: ["말띠", "양띠"] },
  "소띠": { excellent: ["뱀띠", "닭띠"], good: ["쥐띠", "돼지띠"], caution: ["양띠", "말띠"] },
  "호랑이띠": { excellent: ["말띠", "개띠"], good: ["돼지띠", "토끼띠"], caution: ["뱀띠", "원숭이띠"] },
  "토끼띠": { excellent: ["양띠", "돼지띠"], good: ["개띠", "호랑이띠"], caution: ["닭띠", "쥐띠"] },
  "용띠": { excellent: ["쥐띠", "원숭이띠"], good: ["닭띠", "호랑이띠"], caution: ["개띠", "용띠"] },
  "뱀띠": { excellent: ["소띠", "닭띠"], good: ["용띠", "원숭이띠"], caution: ["돼지띠", "호랑이띠"] },
  "말띠": { excellent: ["호랑이띠", "양띠"], good: ["개띠", "토끼띠"], caution: ["쥐띠", "소띠"] },
  "양띠": { excellent: ["토끼띠", "말띠"], good: ["돼지띠", "원숭이띠"], caution: ["소띠", "개띠"] },
  "원숭이띠": { excellent: ["쥐띠", "용띠"], good: ["뱀띠", "양띠"], caution: ["호랑이띠", "돼지띠"] },
  "닭띠": { excellent: ["소띠", "뱀띠"], good: ["용띠", "원숭이띠"], caution: ["토끼띠", "개띠"] },
  "개띠": { excellent: ["호랑이띠", "말띠"], good: ["토끼띠", "양띠"], caution: ["용띠", "닭띠"] },
  "돼지띠": { excellent: ["토끼띠", "양띠"], good: ["호랑이띠", "쥐띠"], caution: ["뱀띠", "원숭이띠"] },
};

/**
 * 오행 조화도 계산 (0-100)
 */
function calculateElementHarmony(element1: Element, element2: Element): number {
  if (element1 === element2) return 85; // 같은 오행 - 이해도 높음

  const relation = ELEMENT_RELATIONS[element1];

  if (relation.generates === element2) return 95; // 상생 관계 (내가 상대를 돕는)
  if (relation.generatedBy === element2) return 90; // 상생 관계 (상대가 나를 돕는)
  if (relation.controls === element2) return 60; // 상극 관계 (내가 상대를 제압)
  if (relation.controlledBy === element2) return 55; // 상극 관계 (상대가 나를 제압)

  return 75; // 중립 관계
}

/**
 * 띠 조화도 계산 (0-100)
 */
function calculateZodiacHarmony(zodiac1: string, zodiac2: string): number {
  if (zodiac1 === zodiac2) return 80; // 같은 띠 - 공감대 높음

  const compatibility = ZODIAC_COMPATIBILITY[zodiac1];
  if (!compatibility) return 70; // 기본값

  if (compatibility.excellent.includes(zodiac2)) return 95;
  if (compatibility.good.includes(zodiac2)) return 85;
  if (compatibility.caution.includes(zodiac2)) return 60;

  return 75; // 중립
}

/**
 * 카테고리별 가중치 조정
 */
const CATEGORY_WEIGHTS: Record<MatchType, { element: number; zodiac: number; personality: number; energy: number }> = {
  "연애궁합": { element: 0.3, zodiac: 0.25, personality: 0.3, energy: 0.15 },
  "학업궁합": { element: 0.25, zodiac: 0.15, personality: 0.4, energy: 0.2 },
  "사업궁합": { element: 0.35, zodiac: 0.2, personality: 0.25, energy: 0.2 },
  "결혼궁합": { element: 0.25, zodiac: 0.3, personality: 0.25, energy: 0.2 },
};

/**
 * 성격 조화도 계산 (띠와 오행 조합 기반)
 */
function calculatePersonalityMatch(profile1: SajuProfile, profile2: SajuProfile): number {
  // 띠와 오행 조합으로 성격 궁합 추정
  const elementScore = calculateElementHarmony(profile1.dominantElement, profile2.dominantElement);
  const zodiacScore = calculateZodiacHarmony(profile1.zodiac, profile2.zodiac);

  return Math.round((elementScore * 0.6 + zodiacScore * 0.4));
}

/**
 * 에너지 균형도 계산
 */
function calculateEnergyBalance(profile1: SajuProfile, profile2: SajuProfile): number {
  const element1 = profile1.dominantElement;
  const element2 = profile2.dominantElement;

  const relation = ELEMENT_RELATIONS[element1];

  // 상생 관계는 에너지가 조화롭게 흐름
  if (relation.generates === element2 || relation.generatedBy === element2) {
    return 90 + Math.floor(Math.random() * 10);
  }

  // 같은 오행은 에너지가 안정적
  if (element1 === element2) {
    return 80 + Math.floor(Math.random() * 10);
  }

  // 상극 관계는 에너지가 충돌하지만 성장 가능
  if (relation.controls === element2 || relation.controlledBy === element2) {
    return 55 + Math.floor(Math.random() * 15);
  }

  return 70 + Math.floor(Math.random() * 10);
}

/**
 * 강점 도출
 */
function deriveStrengths(
  profile1: SajuProfile,
  profile2: SajuProfile,
  breakdown: CompatibilityResult["breakdown"],
  matchType: MatchType
): string[] {
  const strengths: string[] = [];
  const relation = ELEMENT_RELATIONS[profile1.dominantElement];

  // 오행 기반 강점
  if (relation.generates === profile2.dominantElement) {
    strengths.push("서로를 북돋아주는 긍정적인 관계입니다");
  }
  if (breakdown.elementHarmony >= 85) {
    strengths.push("오행 조화가 뛰어나 자연스러운 교감이 가능합니다");
  }

  // 띠 기반 강점
  if (breakdown.zodiacHarmony >= 90) {
    strengths.push("띠 궁합이 최상급으로 서로를 이해하기 쉽습니다");
  }

  // 카테고리별 강점
  if (matchType === "연애궁합") {
    if (breakdown.personalityMatch >= 80) strengths.push("감정적 공감대가 높아 연애가 순조롭습니다");
    if (breakdown.energyBalance >= 85) strengths.push("애정 표현이 자연스럽게 통합니다");
  } else if (matchType === "학업궁합") {
    if (breakdown.personalityMatch >= 75) strengths.push("학습 스타일이 잘 맞아 함께 공부하기 좋습니다");
    if (breakdown.energyBalance >= 80) strengths.push("서로의 장점을 통해 성장할 수 있습니다");
  } else if (matchType === "사업궁합") {
    if (breakdown.elementHarmony >= 80) strengths.push("비즈니스 파트너십이 안정적입니다");
    if (breakdown.energyBalance >= 75) strengths.push("업무 효율이 극대화될 수 있습니다");
  } else if (matchType === "결혼궁합") {
    if (breakdown.zodiacHarmony >= 85) strengths.push("장기적인 관계 유지에 유리합니다");
    if (breakdown.elementHarmony >= 85 && breakdown.zodiacHarmony >= 80) strengths.push("평생 동반자로서 훌륭한 인연입니다");
  }

  return strengths.slice(0, 3); // 최대 3개
}

/**
 * 주의사항 도출
 */
function deriveChallenges(
  profile1: SajuProfile,
  profile2: SajuProfile,
  breakdown: CompatibilityResult["breakdown"],
  matchType: MatchType
): string[] {
  const challenges: string[] = [];
  const relation = ELEMENT_RELATIONS[profile1.dominantElement];

  // 오행 기반 주의사항
  if (relation.controls === profile2.dominantElement || relation.controlledBy === profile2.dominantElement) {
    challenges.push("오행 상극 관계로 때때로 의견 충돌이 있을 수 있습니다");
  }
  if (breakdown.elementHarmony < 70) {
    challenges.push("에너지 불균형이 있어 조율이 필요합니다");
  }

  // 띠 기반 주의사항
  if (breakdown.zodiacHarmony < 70) {
    challenges.push("성격 차이로 인한 오해가 발생할 수 있습니다");
  }

  // 일반적 주의사항
  if (breakdown.personalityMatch < 75) {
    challenges.push("소통과 이해를 위한 노력이 필요합니다");
  }

  if (challenges.length === 0) {
    challenges.push("특별한 주의사항은 없으나 서로에 대한 존중을 잊지 마세요");
  }

  return challenges.slice(0, 2); // 최대 2개
}

/**
 * 조언 생성
 */
function generateAdvice(
  profile1: SajuProfile,
  profile2: SajuProfile,
  breakdown: CompatibilityResult["breakdown"],
  matchType: MatchType
): string[] {
  const advice: string[] = [];
  const relation = ELEMENT_RELATIONS[profile1.dominantElement];

  // 오행 조화 조언
  if (relation.generates === profile2.dominantElement) {
    advice.push("적극적으로 상대를 응원하고 지지해주세요");
  } else if (relation.generatedBy === profile2.dominantElement) {
    advice.push("상대의 도움을 받아들이고 감사함을 표현하세요");
  } else if (relation.controls === profile2.dominantElement) {
    advice.push("때로는 상대에게 주도권을 넘겨주는 것도 좋습니다");
  }

  // 카테고리별 조언
  if (matchType === "연애궁합") {
    advice.push("작은 이벤트와 깊은 대화로 관계를 돈독히 하세요");
    advice.push("서로의 감정을 솔직하게 표현하는 것이 중요합니다");
  } else if (matchType === "학업궁합") {
    advice.push("함께 목표를 설정하고 격려하며 공부하세요");
    advice.push("서로 다른 강점을 활용해 시너지를 내세요");
  } else if (matchType === "사업궁합") {
    advice.push("명확한 역할 분담으로 효율을 높이세요");
    advice.push("정기적인 회의로 의견을 조율하세요");
  } else if (matchType === "결혼궁합") {
    advice.push("장기적인 비전을 함께 그려나가세요");
    advice.push("일상의 작은 배려가 행복의 비결입니다");
  }

  return advice.slice(0, 3); // 최대 3개
}

/**
 * 행운의 활동 추천
 */
function suggestLuckyActivities(
  profile1: SajuProfile,
  profile2: SajuProfile,
  matchType: MatchType
): string[] {
  const activities: string[] = [];
  const elements = [profile1.dominantElement, profile2.dominantElement];

  // 오행 기반 활동
  if (elements.includes("木")) activities.push("공원 산책", "등산");
  if (elements.includes("火")) activities.push("여행", "공연 관람");
  if (elements.includes("土")) activities.push("카페에서 대화", "요리하기");
  if (elements.includes("金")) activities.push("박물관 방문", "명상");
  if (elements.includes("水")) activities.push("바다 여행", "영화 감상");

  // 카테고리별 활동
  if (matchType === "연애궁합") {
    activities.push("데이트 코스 탐방", "커플 취미 찾기");
  } else if (matchType === "학업궁합") {
    activities.push("스터디 카페", "도서관");
  } else if (matchType === "사업궁합") {
    activities.push("비즈니스 세미나 참석", "네트워킹 이벤트");
  } else if (matchType === "결혼궁합") {
    activities.push("집 꾸미기", "가족 모임");
  }

  // 유니크하게 반환 (최대 4개)
  return [...new Set(activities)].slice(0, 4);
}

/**
 * 종합 궁합 계산 (메인 함수)
 */
export function calculateCompatibility(
  profile1: SajuProfile,
  profile2: SajuProfile,
  matchType: MatchType
): CompatibilityResult {
  // 세부 항목 계산
  const elementHarmony = calculateElementHarmony(profile1.dominantElement, profile2.dominantElement);
  const zodiacHarmony = calculateZodiacHarmony(profile1.zodiac, profile2.zodiac);
  const personalityMatch = calculatePersonalityMatch(profile1, profile2);
  const energyBalance = calculateEnergyBalance(profile1, profile2);

  const breakdown = {
    elementHarmony,
    zodiacHarmony,
    personalityMatch,
    energyBalance,
  };

  // 카테고리별 가중치 적용
  const weights = CATEGORY_WEIGHTS[matchType];
  const overall = Math.round(
    elementHarmony * weights.element +
    zodiacHarmony * weights.zodiac +
    personalityMatch * weights.personality +
    energyBalance * weights.energy
  );

  // 강점, 주의사항, 조언 생성
  const strengths = deriveStrengths(profile1, profile2, breakdown, matchType);
  const challenges = deriveChallenges(profile1, profile2, breakdown, matchType);
  const advice = generateAdvice(profile1, profile2, breakdown, matchType);
  const luckyActivities = suggestLuckyActivities(profile1, profile2, matchType);

  return {
    overall,
    breakdown,
    strengths,
    challenges,
    advice,
    luckyActivities,
  };
}

/**
 * 무작위 사용자 생성 (매칭용)
 */
export function generateRandomUser(): SajuProfile {
  const elements: Element[] = ["木", "火", "土", "金", "水"];
  const zodiacs = ["쥐띠", "소띠", "호랑이띠", "토끼띠", "용띠", "뱀띠", "말띠", "양띠", "원숭이띠", "닭띠", "개띠", "돼지띠"];
  const surnames = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임"];

  const element = elements[Math.floor(Math.random() * elements.length)];
  const zodiac = zodiacs[Math.floor(Math.random() * zodiacs.length)];
  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  const birthYear = 1985 + Math.floor(Math.random() * 20); // 1985-2004

  return {
    name: `${surname}*${String.fromCharCode(44032 + Math.floor(Math.random() * 100))}`,
    birthYear,
    zodiac,
    dominantElement: element,
  };
}
