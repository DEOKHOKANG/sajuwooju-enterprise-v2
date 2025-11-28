/**
 * Lunar Calendar Conversion Utilities
 * Using lunar-javascript library for Korean lunar calendar
 */

import { Lunar, Solar } from 'lunar-javascript';

/**
 * Convert solar date to lunar date
 */
export function solarToLunar(date: Date): {
  year: number;
  month: number;
  day: number;
  isLeapMonth: boolean;
} {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();

  return {
    year: lunar.getYear(),
    month: lunar.getMonth(),
    day: lunar.getDay(),
    isLeapMonth: lunar.isLeap(),
  };
}

/**
 * Convert lunar date to solar date
 */
export function lunarToSolar(
  year: number,
  month: number,
  day: number,
  isLeapMonth: boolean = false
): Date {
  const lunar = Lunar.fromYmd(year, month, day, isLeapMonth ? 1 : 0);
  const solar = lunar.getSolar();

  return new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay());
}

/**
 * Format lunar date to Korean string
 * Example: "음력 2024년 10월 15일"
 */
export function formatLunarDate(
  year: number,
  month: number,
  day: number,
  isLeapMonth: boolean = false
): string {
  const leapText = isLeapMonth ? '윤' : '';
  return `음력 ${year}년 ${leapText}${month}월 ${day}일`;
}

/**
 * Get lunar year zodiac (천간지지)
 */
export function getLunarYearZodiac(date: Date): {
  heavenlyStem: string; // 천간
  earthlyBranch: string; // 지지
  zodiacAnimal: string; // 띠
} {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();

  return {
    heavenlyStem: lunar.getYearInGanZhi().substring(0, 1), // 천간 (첫 글자)
    earthlyBranch: lunar.getYearInGanZhi().substring(1, 2), // 지지 (둘째 글자)
    zodiacAnimal: lunar.getYearShengXiao(), // 띠
  };
}

/**
 * Validate if lunar date is valid
 */
export function isValidLunarDate(
  year: number,
  month: number,
  day: number,
  isLeapMonth: boolean = false
): boolean {
  try {
    const lunar = Lunar.fromYmd(year, month, day, isLeapMonth ? 1 : 0);
    const solar = lunar.getSolar();

    // Check if conversion is successful
    return (
      solar.getYear() >= 1900 &&
      solar.getYear() <= 2100 &&
      lunar.getMonth() === month &&
      lunar.getDay() === day
    );
  } catch {
    return false;
  }
}

/**
 * Check if a lunar year has leap month
 */
export function hasLeapMonth(year: number): boolean {
  try {
    // Check each month to see if it has a leap month
    for (let month = 1; month <= 12; month++) {
      try {
        const lunar = Lunar.fromYmd(year, month, 1, 1);
        const solar = lunar.getSolar();

        // If conversion succeeds, there's a leap month
        if (solar.getYear() === year || solar.getYear() === year + 1) {
          return true;
        }
      } catch {
        // Continue checking
      }
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Get leap month number for a given year
 * Returns null if no leap month
 */
export function getLeapMonth(year: number): number | null {
  try {
    for (let month = 1; month <= 12; month++) {
      try {
        const lunar = Lunar.fromYmd(year, month, 1, 1);
        const solar = lunar.getSolar();

        if (solar.getYear() === year || solar.getYear() === year + 1) {
          return month;
        }
      } catch {
        // Continue
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Get number of days in a lunar month
 */
export function getLunarMonthDays(
  year: number,
  month: number,
  isLeapMonth: boolean = false
): number {
  try {
    // Try day 30 first
    if (isValidLunarDate(year, month, 30, isLeapMonth)) {
      return 30;
    }
    // Otherwise it's 29
    return 29;
  } catch {
    return 29; // Default
  }
}

/**
 * 사주 계산을 위한 간지 정보 인터페이스
 */
export interface SajuGanZhi {
  year: string;   // 연주 (년간지) 예: 甲子
  month: string;  // 월주 (월간지)
  day: string;    // 일주 (일간지)
  hour: string;   // 시주 (시간지)
  yearGan: string;  // 년간
  yearZhi: string;  // 년지
  monthGan: string; // 월간
  monthZhi: string; // 월지
  dayGan: string;   // 일간
  dayZhi: string;   // 일지
  hourGan: string;  // 시간
  hourZhi: string;  // 시지
  zodiac: string;   // 띠
}

/**
 * 시간을 시지(時支)로 변환
 * @param birthHour 출생시간 형식 (예: "23-01" for 자시)
 * @returns 시지 (子, 丑, 寅, 卯, 辰, 巳, 午, 未, 申, 酉, 戌, 亥)
 */
function getTimeZhi(birthHour: string): string {
  const timeZhiMap: { [key: string]: string } = {
    '23-01': '子',
    '01-03': '丑',
    '03-05': '寅',
    '05-07': '卯',
    '07-09': '辰',
    '09-11': '巳',
    '11-13': '午',
    '13-15': '未',
    '15-17': '申',
    '17-19': '酉',
    '19-21': '戌',
    '21-23': '亥',
    'unknown': '午', // 모를 경우 정오(午時)로 설정
  };

  return timeZhiMap[birthHour] || '午';
}

/**
 * 일간에 따른 시간 구하기 (오자시일표)
 * @param dayGan 일간
 * @param timeZhi 시지
 * @returns 시간 (천간)
 */
function getHourGan(dayGan: string, timeZhi: string): string {
  // 일간에 따른 시간표 (오자시일표)
  const ganIndex: { [key: string]: number } = {
    '甲': 0, '乙': 1, '丙': 2, '丁': 3, '戊': 4,
    '己': 5, '庚': 6, '辛': 7, '壬': 8, '癸': 9,
  };

  const zhiIndex: { [key: string]: number } = {
    '子': 0, '丑': 1, '寅': 2, '卯': 3, '辰': 4, '巳': 5,
    '午': 6, '未': 7, '申': 8, '酉': 9, '戌': 10, '亥': 11,
  };

  const gans = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

  // 일간 인덱스 가져오기
  const dayIndex = ganIndex[dayGan] || 0;

  // 시지 인덱스 가져오기
  const zhiIdx = zhiIndex[timeZhi] || 0;

  // 오자시일표에 따른 시간 계산
  // 甲己일: 甲子시부터 시작
  // 乙庚일: 丙子시부터 시작
  // 丙辛일: 戊子시부터 시작
  // 丁壬일: 庚子시부터 시작
  // 戊癸일: 壬子시부터 시작
  const startGanIndex = (dayIndex % 5) * 2;
  const hourGanIndex = (startGanIndex + zhiIdx) % 10;

  return gans[hourGanIndex];
}

/**
 * 완전한 사주 간지 정보 계산 (상용화급)
 * @param year 년도
 * @param month 월
 * @param day 일
 * @param calendarType 'solar' | 'lunar'
 * @param birthHour 출생시간 (12지지 형식)
 * @returns 사주 간지 정보
 */
export function getSajuGanZhi(
  year: number,
  month: number,
  day: number,
  calendarType: 'solar' | 'lunar',
  birthHour: string
): SajuGanZhi | null {
  try {
    let lunar: any;

    // 양력/음력에 따라 lunar 객체 생성
    if (calendarType === 'solar') {
      const solarDate = new Date(year, month - 1, day);
      const solar = Solar.fromDate(solarDate);
      lunar = solar.getLunar();
    } else {
      lunar = Lunar.fromYmd(year, month, day);
    }

    // 간지 정보 가져오기
    const yearGanZhi = lunar.getYearInGanZhi(); // 예: 甲子
    const monthGanZhi = lunar.getMonthInGanZhi();
    const dayGanZhi = lunar.getDayInGanZhi();
    const zodiac = lunar.getYearShengXiao();

    // 간과 지 분리
    const yearGan = yearGanZhi.substring(0, 1);
    const yearZhi = yearGanZhi.substring(1, 2);
    const monthGan = monthGanZhi.substring(0, 1);
    const monthZhi = monthGanZhi.substring(1, 2);
    const dayGan = dayGanZhi.substring(0, 1);
    const dayZhi = dayGanZhi.substring(1, 2);

    // 시지 구하기
    const hourZhi = getTimeZhi(birthHour);

    // 시간 구하기 (일간에 따라 결정)
    const hourGan = getHourGan(dayGan, hourZhi);
    const hourGanZhi = hourGan + hourZhi;

    return {
      year: yearGanZhi,
      month: monthGanZhi,
      day: dayGanZhi,
      hour: hourGanZhi,
      yearGan,
      yearZhi,
      monthGan,
      monthZhi,
      dayGan,
      dayZhi,
      hourGan,
      hourZhi,
      zodiac,
    };
  } catch (error) {
    console.error('사주 간지 계산 오류:', error);
    return null;
  }
}

/**
 * 사주팔자 문자열 생성
 * @param ganZhi 사주 간지 정보
 * @returns 사주팔자 문자열 (예: "甲子年 丙寅月 戊辰日 壬子時")
 */
export function formatSajuString(ganZhi: SajuGanZhi): string {
  return `${ganZhi.year}年 ${ganZhi.month}月 ${ganZhi.day}日 ${ganZhi.hour}時`;
}

/**
 * 천간의 오행 계산
 */
export function getGanWuXing(gan: string): string {
  const wuXingMap: { [key: string]: string } = {
    '甲': '木', '乙': '木',
    '丙': '火', '丁': '火',
    '戊': '土', '己': '土',
    '庚': '金', '辛': '金',
    '壬': '水', '癸': '水',
  };

  return wuXingMap[gan] || '未知';
}

/**
 * 지지의 오행 계산
 */
export function getZhiWuXing(zhi: string): string {
  const wuXingMap: { [key: string]: string } = {
    '子': '水', '丑': '土', '寅': '木', '卯': '木',
    '辰': '土', '巳': '火', '午': '火', '未': '土',
    '申': '金', '酉': '金', '戌': '土', '亥': '水',
  };

  return wuXingMap[zhi] || '未知';
}

/**
 * 사주 오행 분석
 * @param ganZhi 사주 간지 정보
 * @returns 오행 통계 및 분석
 */
export interface WuXingAnalysis {
  elements: {
    木: number;
    火: number;
    土: number;
    金: number;
    水: number;
  };
  dominant: string; // 가장 많은 오행
  lacking: string[]; // 부족한 오행 (0개)
  balanced: boolean; // 균형 여부
}

export function analyzeWuXing(ganZhi: SajuGanZhi): WuXingAnalysis {
  const elements = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };

  // 천간 오행 계산
  const gans = [ganZhi.yearGan, ganZhi.monthGan, ganZhi.dayGan, ganZhi.hourGan];
  gans.forEach((gan) => {
    const wuxing = getGanWuXing(gan);
    if (wuxing !== '未知') {
      elements[wuxing as keyof typeof elements]++;
    }
  });

  // 지지 오행 계산
  const zhis = [ganZhi.yearZhi, ganZhi.monthZhi, ganZhi.dayZhi, ganZhi.hourZhi];
  zhis.forEach((zhi) => {
    const wuxing = getZhiWuXing(zhi);
    if (wuxing !== '未知') {
      elements[wuxing as keyof typeof elements]++;
    }
  });

  // 가장 많은 오행 찾기
  let dominant = '木';
  let maxCount = elements.木;
  Object.entries(elements).forEach(([element, count]) => {
    if (count > maxCount) {
      dominant = element;
      maxCount = count;
    }
  });

  // 부족한 오행 찾기
  const lacking: string[] = [];
  Object.entries(elements).forEach(([element, count]) => {
    if (count === 0) {
      lacking.push(element);
    }
  });

  // 균형 여부 (모든 오행이 1개 이상)
  const balanced = lacking.length === 0;

  return {
    elements,
    dominant,
    lacking,
    balanced,
  };
}
