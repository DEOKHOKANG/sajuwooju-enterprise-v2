export interface SajuInput {
  name: string;
  birthDate: Date;
  birthTime: number; // 0-23
  gender: 'male' | 'female';
  isLunar: boolean;
}

export interface SajuPillar {
  heaven: string; // 천간
  earth: string; // 지지
}

export interface SajuResult {
  sessionId: string;
  input: SajuInput;
  pillars: {
    year: SajuPillar;
    month: SajuPillar;
    day: SajuPillar;
    time: SajuPillar;
  };
  fortunes: Fortune[];
  createdAt: Date;
}

export interface Fortune {
  id: string;
  category: string;
  score: number; // 0-100
  description: string;
  advice: string;
}

export const HEAVENLY_STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'] as const;
export const EARTHLY_BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'] as const;

export const FORTUNE_CATEGORIES = [
  '종합운',
  '애정운',
  '재물운',
  '건강운',
  '직업운',
  '학업운',
  '가족운',
  '인간관계',
  '여행운',
  '금전운'
] as const;
