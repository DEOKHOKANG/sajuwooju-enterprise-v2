/**
 * Saju Input Form Data Models
 * 사주 분석 입력 폼 데이터 모델
 */

// 사주 분석 카테고리
export const SAJU_CATEGORIES = [
  {
    id: 'love',
    name: '연애운',
    icon: '💕',
    element: '火',
    gradient: 'from-pink-500 to-rose-600',
    description: '사랑과 인연의 흐름을 분석합니다',
    keywords: ['연애', '결혼', '인연', '애정운'],
  },
  {
    id: 'wealth',
    name: '재물운',
    icon: '💰',
    element: '金',
    gradient: 'from-amber-500 to-orange-600',
    description: '재물과 금전의 운세를 봅니다',
    keywords: ['금전', '재산', '재테크', '투자'],
  },
  {
    id: 'career',
    name: '직업운',
    icon: '💼',
    element: '木',
    gradient: 'from-violet-500 to-purple-600',
    description: '직업과 커리어의 방향을 제시합니다',
    keywords: ['직업', '승진', '이직', '사업'],
  },
  {
    id: 'compatibility',
    name: '궁합',
    icon: '💑',
    element: '水',
    gradient: 'from-blue-500 to-cyan-600',
    description: '두 사람의 궁합을 분석합니다',
    keywords: ['궁합', '궁합보기', '커플', '배우자'],
  },
  {
    id: 'yearly',
    name: '연운',
    icon: '📅',
    element: '土',
    gradient: 'from-emerald-500 to-teal-600',
    description: '올해의 운세를 상세히 봅니다',
    keywords: ['연운', '올해운세', '년운', '신년운세'],
  },
  {
    id: 'comprehensive',
    name: '종합분석',
    icon: '🌟',
    element: '五行',
    gradient: 'from-indigo-500 to-purple-600',
    description: '전반적인 운세를 종합 분석합니다',
    keywords: ['종합', '전체운세', '사주팔자', '명리'],
  },
] as const;

export type SajuCategoryId = typeof SAJU_CATEGORIES[number]['id'];

// 성별
export type Gender = 'male' | 'female';

// 양력/음력
export type CalendarType = 'solar' | 'lunar';

// 출생시간 (12지지)
export const BIRTH_HOURS = [
  { value: '23-01', label: '자시 (子時, 23:00-01:00)', jiji: '子' },
  { value: '01-03', label: '축시 (丑時, 01:00-03:00)', jiji: '丑' },
  { value: '03-05', label: '인시 (寅時, 03:00-05:00)', jiji: '寅' },
  { value: '05-07', label: '묘시 (卯時, 05:00-07:00)', jiji: '卯' },
  { value: '07-09', label: '진시 (辰時, 07:00-09:00)', jiji: '辰' },
  { value: '09-11', label: '사시 (巳時, 09:00-11:00)', jiji: '巳' },
  { value: '11-13', label: '오시 (午時, 11:00-13:00)', jiji: '午' },
  { value: '13-15', label: '미시 (未時, 13:00-15:00)', jiji: '未' },
  { value: '15-17', label: '신시 (申時, 15:00-17:00)', jiji: '申' },
  { value: '17-19', label: '유시 (酉時, 17:00-19:00)', jiji: '酉' },
  { value: '19-21', label: '술시 (戌時, 19:00-21:00)', jiji: '戌' },
  { value: '21-23', label: '해시 (亥時, 21:00-23:00)', jiji: '亥' },
  { value: 'unknown', label: '모름 (시간 모를 때)', jiji: '?' },
] as const;

// 사주 입력 데이터 인터페이스
export interface SajuInputData {
  // Step 1: 카테고리
  category: SajuCategoryId;

  // Step 2: 기본 정보
  name: string;
  gender: Gender;

  // Step 3: 생년월일
  calendarType: CalendarType;
  year: number;
  month: number;
  day: number;

  // Step 4: 출생시간
  birthHour: string; // BIRTH_HOURS의 value

  // 궁합 전용 (상대방 정보)
  partnerName?: string;
  partnerGender?: Gender;
  partnerCalendarType?: CalendarType;
  partnerYear?: number;
  partnerMonth?: number;
  partnerDay?: number;
  partnerBirthHour?: string;
}

// 기본값
export const DEFAULT_SAJU_INPUT: Partial<SajuInputData> = {
  category: 'comprehensive',
  gender: 'male',
  calendarType: 'solar',
  birthHour: 'unknown',
};

// Form Step 정의
export type FormStep = 1 | 2 | 3 | 4;

export const FORM_STEPS: Record<FormStep, string> = {
  1: '카테고리 선택',
  2: '기본 정보',
  3: '생년월일',
  4: '출생시간',
};
