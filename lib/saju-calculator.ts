/**
 * Saju Calculator (사주 계산 엔진)
 * Phase 8.6: Mock Saju Calculation Engine
 *
 * Calculates Four Pillars (사주팔자) from birth date and time
 * Based on traditional Korean/Chinese calendar system with lunar support
 */

import { SajuInput, SajuResult, SajuPillar, Fortune, HEAVENLY_STEMS, EARTHLY_BRANCHES, FORTUNE_CATEGORIES } from './types/saju';
import { solarToLunar, lunarToSolar } from './lunar-calendar';

/**
 * 오행 (Five Elements) mapping
 */
const FIVE_ELEMENTS = {
  갑: '목', 을: '목',
  병: '화', 정: '화',
  무: '토', 기: '토',
  경: '금', 신: '금',
  임: '수', 계: '수',
  자: '수', 축: '토', 인: '목', 묘: '목', 진: '토', 사: '화',
  오: '화', 미: '토', 유: '금', 술: '토', 해: '수',
} as const;

/**
 * Calculate Year Pillar (년주)
 * Based on sexagenary cycle (60-year cycle)
 */
function calculateYearPillar(year: number): SajuPillar {
  // Base year: 1984 = 갑자년 (start of cycle)
  const baseYear = 1984;
  const offset = (year - baseYear) % 60;
  const adjustedOffset = offset < 0 ? offset + 60 : offset;

  const heavenIndex = adjustedOffset % 10;
  const earthIndex = adjustedOffset % 12;

  return {
    heaven: HEAVENLY_STEMS[heavenIndex],
    earth: EARTHLY_BRANCHES[earthIndex],
  };
}

/**
 * Calculate Month Pillar (월주)
 * Based on year stem and month
 */
function calculateMonthPillar(year: number, month: number): SajuPillar {
  const yearPillar = calculateYearPillar(year);
  const yearStemIndex = HEAVENLY_STEMS.indexOf(yearPillar.heaven as any);

  // Month stem calculation (simplified)
  const monthStemBase = (yearStemIndex * 2 + 2) % 10;
  const monthStemIndex = (monthStemBase + month - 1) % 10;

  // Month branch mapping to 지지
  const monthBranchIndex = (month + 1) % 12;

  return {
    heaven: HEAVENLY_STEMS[monthStemIndex],
    earth: EARTHLY_BRANCHES[monthBranchIndex],
  };
}

/**
 * Calculate Day Pillar (일주)
 * Based on Julian day number
 */
function calculateDayPillar(date: Date): SajuPillar {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Julian day calculation
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;

  const jdn =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  // Convert to sexagenary cycle
  const offset = (jdn + 49) % 60;
  const heavenIndex = offset % 10;
  const earthIndex = offset % 12;

  return {
    heaven: HEAVENLY_STEMS[heavenIndex],
    earth: EARTHLY_BRANCHES[earthIndex],
  };
}

/**
 * Calculate Time Pillar (시주)
 * Based on hour and day stem
 */
function calculateTimePillar(hour: number, dayPillar: SajuPillar): SajuPillar {
  // Time branch mapping
  let timeBranchIndex: number;
  if (hour >= 23 || hour < 1) timeBranchIndex = 0; // 자시
  else if (hour >= 1 && hour < 3) timeBranchIndex = 1; // 축시
  else if (hour >= 3 && hour < 5) timeBranchIndex = 2; // 인시
  else if (hour >= 5 && hour < 7) timeBranchIndex = 3; // 묘시
  else if (hour >= 7 && hour < 9) timeBranchIndex = 4; // 진시
  else if (hour >= 9 && hour < 11) timeBranchIndex = 5; // 사시
  else if (hour >= 11 && hour < 13) timeBranchIndex = 6; // 오시
  else if (hour >= 13 && hour < 15) timeBranchIndex = 7; // 미시
  else if (hour >= 15 && hour < 17) timeBranchIndex = 8; // 신시
  else if (hour >= 17 && hour < 19) timeBranchIndex = 9; // 유시
  else if (hour >= 19 && hour < 21) timeBranchIndex = 10; // 술시
  else timeBranchIndex = 11; // 해시

  // Time stem calculation based on day stem
  const dayStemIndex = HEAVENLY_STEMS.indexOf(dayPillar.heaven as any);
  const timeStemBase = (dayStemIndex * 2) % 10;
  const timeStemIndex = (timeStemBase + timeBranchIndex) % 10;

  return {
    heaven: HEAVENLY_STEMS[timeStemIndex],
    earth: EARTHLY_BRANCHES[timeBranchIndex],
  };
}

/**
 * Main function: Calculate Saju from input
 */
export function calculateSaju(input: SajuInput): SajuResult {
  // Convert to solar date if lunar
  let solarDate = input.birthDate;
  if (input.isLunar) {
    const lunarYear = input.birthDate.getFullYear();
    const lunarMonth = input.birthDate.getMonth() + 1;
    const lunarDay = input.birthDate.getDate();
    solarDate = lunarToSolar(lunarYear, lunarMonth, lunarDay, false);
  }

  // Calculate each pillar
  const year = solarDate.getFullYear();
  const month = solarDate.getMonth() + 1;

  const yearPillar = calculateYearPillar(year);
  const monthPillar = calculateMonthPillar(year, month);
  const dayPillar = calculateDayPillar(solarDate);
  const timePillar = calculateTimePillar(input.birthTime, dayPillar);

  const pillars = {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    time: timePillar,
  };

  const sessionId = generateSessionId();
  const fortunes = generateFortunes();

  return {
    sessionId,
    input,
    pillars,
    fortunes,
    createdAt: new Date(),
  };
}

/**
 * Generate session ID
 */
function generateSessionId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `saju-${timestamp}-${random}`;
}

/**
 * Generate mock fortunes (will be replaced by AI analysis)
 */
function generateFortunes(): Fortune[] {
  return FORTUNE_CATEGORIES.map((category, index) => {
    return {
      id: `fortune-${index}`,
      category,
      score: Math.floor(Math.random() * 30) + 70,
      description: getMockDescription(category),
      advice: getMockAdvice(category),
    };
  });
}

function getMockDescription(category: string): string {
  const descriptions: Record<string, string> = {
    '종합운': '전반적으로 긍정적인 기운이 흐르고 있습니다.',
    '애정운': '새로운 인연을 만날 수 있는 좋은 시기입니다.',
    '재물운': '재물운이 상승하는 시기로 투자에 좋습니다.',
    '건강운': '건강에 주의가 필요한 시기입니다.',
    '직업운': '업무에서 좋은 성과를 거둘 수 있습니다.',
    '학업운': '학업 성취도가 높아지는 시기입니다.',
    '가족운': '가족과의 화목한 시간을 보낼 수 있습니다.',
    '인간관계': '새로운 사람들과의 만남이 많아집니다.',
    '여행운': '여행을 통해 좋은 경험을 할 수 있습니다.',
    '금전운': '금전적으로 안정적인 시기입니다.',
  };
  return descriptions[category] || '긍정적인 운세입니다.';
}

function getMockAdvice(category: string): string {
  const advices: Record<string, string> = {
    '종합운': '긍정적인 마음가짐을 유지하세요.',
    '애정운': '적극적으로 다가가 보세요.',
    '재물운': '계획적인 재테크가 필요합니다.',
    '건강운': '규칙적인 생활을 유지하세요.',
    '직업운': '새로운 도전을 두려워하지 마세요.',
    '학업운': '꾸준한 노력이 중요합니다.',
    '가족운': '가족과의 대화 시간을 늘려보세요.',
    '인간관계': '진심 어린 소통이 중요합니다.',
    '여행운': '새로운 경험을 즐겨보세요.',
    '금전운': '불필요한 지출을 줄이세요.',
  };
  return advices[category] || '현재 상태를 유지하세요.';
}

/**
 * Get element (오행) for a character
 */
export function getElement(char: string): string {
  return FIVE_ELEMENTS[char as keyof typeof FIVE_ELEMENTS] || '';
}

/**
 * Get element distribution (오행 분포)
 */
export function getElementDistribution(pillars: {
  year: SajuPillar;
  month: SajuPillar;
  day: SajuPillar;
  time: SajuPillar;
}): Record<string, number> {
  const distribution: Record<string, number> = {
    목: 0,
    화: 0,
    토: 0,
    금: 0,
    수: 0,
  };

  // Count elements from all 8 characters
  const chars = [
    pillars.year.heaven,
    pillars.year.earth,
    pillars.month.heaven,
    pillars.month.earth,
    pillars.day.heaven,
    pillars.day.earth,
    pillars.time.heaven,
    pillars.time.earth,
  ];

  chars.forEach((char) => {
    const element = getElement(char);
    if (element) {
      distribution[element]++;
    }
  });

  return distribution;
}

/**
 * Format saju pillar to string
 */
export function formatSajuPillar(pillar: SajuPillar): string {
  return `${pillar.heaven}${pillar.earth}`;
}

/**
 * Get saju summary
 */
export function getSajuSummary(pillars: {
  year: SajuPillar;
  month: SajuPillar;
  day: SajuPillar;
  time: SajuPillar;
}): {
  pillarsText: string;
  dominantElement: string;
  weakElement: string;
} {
  const pillarsText = `${formatSajuPillar(pillars.year)} ${formatSajuPillar(pillars.month)} ${formatSajuPillar(pillars.day)} ${formatSajuPillar(pillars.time)}`;
  const distribution = getElementDistribution(pillars);

  // Find dominant and weak elements
  let maxElement = '목';
  let minElement = '목';
  let maxCount = distribution['목'];
  let minCount = distribution['목'];

  Object.entries(distribution).forEach(([element, count]) => {
    if (count > maxCount) {
      maxCount = count;
      maxElement = element;
    }
    if (count < minCount) {
      minCount = count;
      minElement = element;
    }
  });

  return {
    pillarsText,
    dominantElement: maxElement,
    weakElement: minElement,
  };
}
