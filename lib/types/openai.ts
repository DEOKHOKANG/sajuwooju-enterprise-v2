/**
 * OpenAI Integration Types
 * Phase 8.7-8.9: AI-powered Saju Analysis
 */

export type SajuCategory =
  | 'wealth' // 재물운
  | 'love' // 애정운/궁합
  | 'health' // 건강운
  | 'breakup_recovery' // 이별/재회
  | 'marriage' // 결혼운
  | 'new_relationship' // 새로운 연인
  | 'career' // 직업운/취업
  | 'education' // 학업운
  | 'business' // 사업운
  | 'investment' // 투자운
  | 'relocation' // 이사/거주지
  | 'feng_shui'; // 풍수지리/음양오행

export interface SajuCategoryInfo {
  id: SajuCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
  price: number; // KRW
}

export interface AIAnalysisRequest {
  category: SajuCategory;
  sajuData: {
    name: string;
    birthDate: Date;
    birthTime: number;
    gender: 'male' | 'female';
    isLunar: boolean;
    // Calculated pillars
    pillars: {
      year: { heaven: string; earth: string };
      month: { heaven: string; earth: string };
      day: { heaven: string; earth: string };
      time: { heaven: string; earth: string };
    };
  };
  // Optional: For compatibility analysis
  partnerData?: {
    name: string;
    birthDate: Date;
    birthTime: number;
    gender: 'male' | 'female';
    isLunar: boolean;
  };
}

export interface AIAnalysisResponse {
  category: SajuCategory;
  analysis: {
    summary: string; // 한 줄 요약
    overall: string; // 종합 분석 (3-5문단)
    strengths: string[]; // 강점 (3-5개)
    weaknesses: string[]; // 약점/주의사항 (3-5개)
    advice: string[]; // 조언 (5-7개)
    luckyElements: {
      colors: string[]; // 행운의 색
      directions: string[]; // 행운의 방향
      numbers: string[]; // 행운의 숫자
      items: string[]; // 행운의 아이템
    };
    // Category-specific fields
    score?: number; // 0-100 (궁합 점수 등)
    timeline?: {
      short_term: string; // 1-3개월
      mid_term: string; // 6개월-1년
      long_term: string; // 1-3년
    };
  };
  metadata: {
    generatedAt: Date;
    model: string;
    tokens: number;
  };
}

export interface AIPromptConfig {
  category: SajuCategory;
  systemPrompt: string;
  userPromptTemplate: string;
  maxTokens: number;
  temperature: number;
}
