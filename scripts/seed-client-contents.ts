/**
 * 클라이언트 사이트용 콘텐츠 시드 스크립트
 * 어드민에서 관리 가능한 사주 콘텐츠를 대량 생성합니다.
 */

import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// 클라이언트에서 사용하는 카테고리 설정 (CATEGORY_CONFIG와 동일)
const CLIENT_CATEGORIES = [
  {
    name: '연애운',
    slug: 'love-fortune',
    icon: '💕',
    color: '#FF6B9D',
    gradient: 'from-pink-500 to-rose-600',
    description: '연애와 사랑에 관한 운세 분석',
    shortDesc: '연애, 인연, 소울메이트 분석',
    order: 1,
  },
  {
    name: '재물운',
    slug: 'wealth-fortune',
    icon: '💰',
    color: '#FFD700',
    gradient: 'from-amber-500 to-orange-600',
    description: '재물과 금전에 관한 운세 분석',
    shortDesc: '재물, 투자, 수입 분석',
    order: 2,
  },
  {
    name: '직장운',
    slug: 'career-fortune',
    icon: '💼',
    color: '#4169E1',
    gradient: 'from-blue-500 to-indigo-600',
    description: '직장과 커리어에 관한 운세 분석',
    shortDesc: '취업, 승진, 이직 분석',
    order: 3,
  },
  {
    name: '건강운',
    slug: 'health-fortune',
    icon: '🏥',
    color: '#32CD32',
    gradient: 'from-emerald-500 to-green-600',
    description: '건강과 웰빙에 관한 운세 분석',
    shortDesc: '건강, 체력, 회복 분석',
    order: 4,
  },
  {
    name: '월간운세',
    slug: 'monthly-fortune',
    icon: '📅',
    color: '#7C3AED',
    gradient: 'from-purple-500 to-violet-600',
    description: '월별 종합 운세 분석',
    shortDesc: '월간, 주간, 일간 운세',
    order: 5,
  },
  {
    name: '궁합',
    slug: 'compatibility',
    icon: '💑',
    color: '#FF1493',
    gradient: 'from-red-500 to-pink-600',
    description: '두 사람의 궁합 분석',
    shortDesc: '연인, 부부, 친구 궁합',
    order: 6,
  },
];

// 각 카테고리별 템플릿
const TEMPLATES_BY_CATEGORY: Record<string, Array<{
  name: string;
  slug: string;
  description: string;
  type: string;
  layout: any;
  fields: Array<{ name: string; type: string; label: string; validation?: any }>;
}>> = {
  'love-fortune': [
    {
      name: '오늘의 연애운',
      slug: 'daily-love',
      description: '오늘 하루의 연애운을 확인하세요',
      type: 'single',
      layout: {
        sections: [
          { type: 'header', title: '오늘의 연애운' },
          { type: 'content', key: 'description' },
          { type: 'score', key: 'loveScore', label: '연애운 점수' },
        ],
      },
      fields: [
        { name: 'description', type: 'textarea', label: '설명', validation: { required: true } },
        { name: 'loveScore', type: 'number', label: '점수', validation: { required: true } },
      ],
    },
    {
      name: '이상형 분석',
      slug: 'ideal-type',
      description: '사주로 보는 나의 이상형',
      type: 'single',
      layout: {
        sections: [
          { type: 'header', title: '이상형 분석' },
          { type: 'content', key: 'idealType' },
          { type: 'traits', key: 'traits' },
        ],
      },
      fields: [
        { name: 'idealType', type: 'textarea', label: '이상형 설명' },
        { name: 'traits', type: 'textarea', label: '특성' },
      ],
    },
  ],
  'wealth-fortune': [
    {
      name: '재물운 타임라인',
      slug: 'wealth-timeline',
      description: '월별 재물운 흐름',
      type: 'timeline',
      layout: {
        sections: [
          { type: 'header', title: '재물운 타임라인' },
          { type: 'timeline', key: 'monthlyWealth' },
        ],
      },
      fields: [
        { name: 'monthlyWealth', type: 'textarea', label: '월별 재물운' },
        { name: 'wealthScore', type: 'number', label: '재물운 점수' },
      ],
    },
    {
      name: '투자 운세',
      slug: 'investment',
      description: '투자 적기와 주의점',
      type: 'single',
      layout: {
        sections: [
          { type: 'header', title: '투자 운세' },
          { type: 'content', key: 'investmentAdvice' },
        ],
      },
      fields: [
        { name: 'investmentAdvice', type: 'textarea', label: '투자 조언' },
        { name: 'riskLevel', type: 'select', label: '위험도' },
      ],
    },
  ],
  'career-fortune': [
    {
      name: '직업 적성 분석',
      slug: 'career-aptitude',
      description: '나에게 맞는 직업 찾기',
      type: 'comparison',
      layout: {
        sections: [
          { type: 'header', title: '직업 적성 분석' },
          { type: 'comparison', key: 'careerOptions' },
        ],
      },
      fields: [
        { name: 'careerOptions', type: 'textarea', label: '직업 옵션' },
        { name: 'aptitudeScore', type: 'number', label: '적성 점수' },
      ],
    },
    {
      name: '승진운',
      slug: 'promotion',
      description: '승진 가능성과 시기',
      type: 'single',
      layout: {
        sections: [
          { type: 'header', title: '승진운 분석' },
          { type: 'content', key: 'promotionForecast' },
        ],
      },
      fields: [
        { name: 'promotionForecast', type: 'textarea', label: '승진 전망' },
        { name: 'probability', type: 'number', label: '가능성 %' },
      ],
    },
  ],
  'health-fortune': [
    {
      name: '건강 주의사항',
      slug: 'health-caution',
      description: '사주로 보는 건강 관리법',
      type: 'single',
      layout: {
        sections: [
          { type: 'header', title: '건강 주의사항' },
          { type: 'content', key: 'healthAdvice' },
        ],
      },
      fields: [
        { name: 'healthAdvice', type: 'textarea', label: '건강 조언' },
        { name: 'weakPoints', type: 'textarea', label: '주의 부위' },
      ],
    },
    {
      name: '체력 운세',
      slug: 'vitality',
      description: '에너지 레벨과 활력',
      type: 'single',
      layout: {
        sections: [
          { type: 'header', title: '체력 운세' },
          { type: 'score', key: 'vitalityScore' },
        ],
      },
      fields: [
        { name: 'vitalityScore', type: 'number', label: '활력 점수' },
        { name: 'tips', type: 'textarea', label: '체력 관리 팁' },
      ],
    },
  ],
  'monthly-fortune': [
    {
      name: '이달의 운세',
      slug: 'this-month',
      description: '이번 달 종합 운세',
      type: 'single',
      layout: {
        sections: [
          { type: 'header', title: '이달의 운세' },
          { type: 'overview', key: 'monthlyOverview' },
        ],
      },
      fields: [
        { name: 'monthlyOverview', type: 'textarea', label: '월간 개요' },
        { name: 'luckyDays', type: 'text', label: '행운의 날' },
      ],
    },
    {
      name: '주간 운세',
      slug: 'weekly',
      description: '이번 주 운세',
      type: 'single',
      layout: {
        sections: [
          { type: 'header', title: '주간 운세' },
          { type: 'content', key: 'weeklyForecast' },
        ],
      },
      fields: [
        { name: 'weeklyForecast', type: 'textarea', label: '주간 전망' },
      ],
    },
  ],
  'compatibility': [
    {
      name: '커플 궁합',
      slug: 'couple-match',
      description: '연인 궁합 분석',
      type: 'comparison',
      layout: {
        sections: [
          { type: 'header', title: '커플 궁합' },
          { type: 'compatibility-meter', key: 'matchScore' },
        ],
      },
      fields: [
        { name: 'matchScore', type: 'number', label: '궁합 점수' },
        { name: 'analysis', type: 'textarea', label: '궁합 분석' },
      ],
    },
    {
      name: '친구 궁합',
      slug: 'friend-match',
      description: '친구/동료 궁합 분석',
      type: 'comparison',
      layout: {
        sections: [
          { type: 'header', title: '친구 궁합' },
          { type: 'compatibility-meter', key: 'friendScore' },
        ],
      },
      fields: [
        { name: 'friendScore', type: 'number', label: '친구 궁합 점수' },
        { name: 'strengths', type: 'textarea', label: '우정의 강점' },
      ],
    },
  ],
};

// 각 카테고리별 콘텐츠 데이터
const CONTENTS_BY_CATEGORY: Record<string, Array<{
  templateSlug: string;
  title: string;
  slug: string;
  excerpt: string;
  data: any;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
}>> = {
  'love-fortune': [
    {
      templateSlug: 'daily-love',
      title: '재회 가능성 분석',
      slug: 'reunion-possibility',
      excerpt: '헤어진 연인과 재회할 수 있을까요?',
      data: { description: '사주 분석을 통해 재회 가능성을 확인합니다.', loveScore: 78 },
      seoTitle: '재회 가능성 분석 | 사주우주',
      seoDescription: '헤어진 연인과의 재회 가능성을 사주로 분석합니다',
      seoKeywords: ['재회', '연애운', '사주'],
    },
    {
      templateSlug: 'daily-love',
      title: '짝사랑 성공률',
      slug: 'crush-success-rate',
      excerpt: '내 짝사랑이 이루어질 확률은?',
      data: { description: '짝사랑의 성공 가능성을 분석합니다.', loveScore: 65 },
      seoTitle: '짝사랑 성공률 | 사주우주',
      seoDescription: '짝사랑이 이루어질 확률을 사주로 확인하세요',
      seoKeywords: ['짝사랑', '연애', '사주'],
    },
    {
      templateSlug: 'ideal-type',
      title: '결혼 적기 분석',
      slug: 'marriage-timing',
      excerpt: '나의 결혼 최적 시기는 언제일까요?',
      data: { idealType: '안정적이고 따뜻한 사람', traits: '금과 수의 조화' },
      seoTitle: '결혼 적기 분석 | 사주우주',
      seoDescription: '사주로 보는 나의 결혼 최적 시기',
      seoKeywords: ['결혼', '결혼운', '사주'],
    },
    {
      templateSlug: 'ideal-type',
      title: '이상형 찾기',
      slug: 'ideal-type-finder',
      excerpt: '사주로 보는 나의 완벽한 이상형',
      data: { idealType: '화의 기운을 가진 활발한 사람', traits: '열정과 에너지' },
      seoTitle: '이상형 찾기 | 사주우주',
      seoDescription: '사주 분석으로 찾는 나의 이상형',
      seoKeywords: ['이상형', '연애', '사주'],
    },
    {
      templateSlug: 'daily-love',
      title: '연인 관계 분석',
      slug: 'relationship-compatibility',
      excerpt: '현재 연인과의 관계는 어떨까요?',
      data: { description: '현재 연인과의 관계 발전 가능성을 분석합니다.', loveScore: 82 },
      seoTitle: '연인 관계 분석 | 사주우주',
      seoDescription: '현재 연인과의 사주 궁합 분석',
      seoKeywords: ['연인', '궁합', '연애운'],
    },
    {
      templateSlug: 'daily-love',
      title: '인연 만남 시기',
      slug: 'meeting-timing',
      excerpt: '소중한 인연을 만날 시기는?',
      data: { description: '새로운 인연이 다가올 시기를 예측합니다.', loveScore: 70 },
      seoTitle: '인연 만남 시기 | 사주우주',
      seoDescription: '새로운 인연을 만날 시기를 사주로 확인하세요',
      seoKeywords: ['인연', '만남', '연애운'],
    },
  ],
  'wealth-fortune': [
    {
      templateSlug: 'wealth-timeline',
      title: '올해 재물운 흐름',
      slug: 'yearly-wealth-flow',
      excerpt: '2025년 나의 재물운은?',
      data: { monthlyWealth: '상반기 안정, 하반기 상승', wealthScore: 75 },
      seoTitle: '2025 재물운 | 사주우주',
      seoDescription: '2025년 재물운 흐름을 확인하세요',
      seoKeywords: ['재물운', '2025', '사주'],
    },
    {
      templateSlug: 'investment',
      title: '투자 적기 분석',
      slug: 'investment-timing',
      excerpt: '지금이 투자할 때인가요?',
      data: { investmentAdvice: '신중한 투자가 필요한 시기', riskLevel: 'medium' },
      seoTitle: '투자 적기 분석 | 사주우주',
      seoDescription: '사주로 보는 투자 최적 시기',
      seoKeywords: ['투자', '재물운', '사주'],
    },
    {
      templateSlug: 'wealth-timeline',
      title: '부업 운세',
      slug: 'side-income-fortune',
      excerpt: '부업으로 수입을 늘릴 수 있을까?',
      data: { monthlyWealth: '창의적인 부업이 길한 시기', wealthScore: 68 },
      seoTitle: '부업 운세 | 사주우주',
      seoDescription: '부업 성공 가능성을 사주로 확인',
      seoKeywords: ['부업', '수입', '재물운'],
    },
    {
      templateSlug: 'investment',
      title: '부동산 운세',
      slug: 'real-estate-fortune',
      excerpt: '부동산 매매 타이밍은?',
      data: { investmentAdvice: '토의 기운이 강한 하반기가 유리', riskLevel: 'low' },
      seoTitle: '부동산 운세 | 사주우주',
      seoDescription: '부동산 투자 시기를 사주로 확인',
      seoKeywords: ['부동산', '투자', '사주'],
    },
    {
      templateSlug: 'wealth-timeline',
      title: '복권운 분석',
      slug: 'lottery-fortune',
      excerpt: '나의 횡재운은 어떨까?',
      data: { monthlyWealth: '예상치 못한 행운이 찾아올 수 있음', wealthScore: 55 },
      seoTitle: '복권운 분석 | 사주우주',
      seoDescription: '횡재운과 복권운을 사주로 분석',
      seoKeywords: ['복권', '횡재', '재물운'],
    },
    {
      templateSlug: 'investment',
      title: '급여 인상 운',
      slug: 'salary-increase',
      excerpt: '연봉 인상 가능성은?',
      data: { investmentAdvice: '적극적인 협상이 유리한 시기', riskLevel: 'low' },
      seoTitle: '급여 인상 운 | 사주우주',
      seoDescription: '연봉 협상 성공 가능성을 확인하세요',
      seoKeywords: ['연봉', '급여', '재물운'],
    },
  ],
  'career-fortune': [
    {
      templateSlug: 'career-aptitude',
      title: '나의 적성 직업',
      slug: 'best-career-match',
      excerpt: '사주로 찾는 천직',
      data: { careerOptions: '창의적 분야, 기획/전략', aptitudeScore: 85 },
      seoTitle: '적성 직업 분석 | 사주우주',
      seoDescription: '나에게 맞는 직업을 사주로 찾아보세요',
      seoKeywords: ['적성', '직업', '진로'],
    },
    {
      templateSlug: 'promotion',
      title: '승진 가능성',
      slug: 'promotion-possibility',
      excerpt: '올해 승진할 수 있을까?',
      data: { promotionForecast: '상반기 기회 포착이 중요', probability: 72 },
      seoTitle: '승진 가능성 분석 | 사주우주',
      seoDescription: '올해 승진 가능성을 사주로 확인',
      seoKeywords: ['승진', '직장운', '사주'],
    },
    {
      templateSlug: 'career-aptitude',
      title: '이직 타이밍',
      slug: 'job-change-timing',
      excerpt: '지금이 이직할 때?',
      data: { careerOptions: '안정보다 도전이 필요한 시기', aptitudeScore: 78 },
      seoTitle: '이직 타이밍 | 사주우주',
      seoDescription: '이직 최적 시기를 사주로 분석',
      seoKeywords: ['이직', '전직', '직장운'],
    },
    {
      templateSlug: 'promotion',
      title: '사업 성공 운',
      slug: 'business-success',
      excerpt: '창업/사업 성공 가능성은?',
      data: { promotionForecast: '파트너십이 중요한 시기', probability: 68 },
      seoTitle: '사업 성공 운 | 사주우주',
      seoDescription: '창업과 사업 성공 가능성을 분석',
      seoKeywords: ['창업', '사업', '직장운'],
    },
    {
      templateSlug: 'career-aptitude',
      title: '직장 내 인간관계',
      slug: 'workplace-relationships',
      excerpt: '직장 동료/상사와의 관계는?',
      data: { careerOptions: '소통과 협력이 필요한 시기', aptitudeScore: 70 },
      seoTitle: '직장 인간관계 | 사주우주',
      seoDescription: '직장 내 인간관계 운세를 확인하세요',
      seoKeywords: ['직장', '인간관계', '직장운'],
    },
    {
      templateSlug: 'promotion',
      title: '취업 성공 운',
      slug: 'job-hunting-fortune',
      excerpt: '취업 성공 가능성은?',
      data: { promotionForecast: '적극적인 지원이 결실을 맺는 시기', probability: 75 },
      seoTitle: '취업 성공 운 | 사주우주',
      seoDescription: '취업 성공 가능성을 사주로 분석',
      seoKeywords: ['취업', '구직', '직장운'],
    },
  ],
  'health-fortune': [
    {
      templateSlug: 'health-caution',
      title: '올해 건강 주의점',
      slug: 'yearly-health-caution',
      excerpt: '2025년 건강 관리 포인트',
      data: { healthAdvice: '과로를 피하고 충분한 휴식이 필요', weakPoints: '소화기, 허리' },
      seoTitle: '건강 주의점 | 사주우주',
      seoDescription: '올해 주의해야 할 건강 포인트',
      seoKeywords: ['건강', '건강운', '사주'],
    },
    {
      templateSlug: 'vitality',
      title: '체력 관리 운세',
      slug: 'vitality-management',
      excerpt: '나의 체력과 에너지 레벨',
      data: { vitalityScore: 72, tips: '아침 운동이 효과적' },
      seoTitle: '체력 관리 운세 | 사주우주',
      seoDescription: '사주로 보는 체력 관리 방법',
      seoKeywords: ['체력', '에너지', '건강운'],
    },
    {
      templateSlug: 'health-caution',
      title: '질병 예방 운세',
      slug: 'disease-prevention',
      excerpt: '주의해야 할 건강 위험',
      data: { healthAdvice: '정기 검진과 예방이 중요한 시기', weakPoints: '호흡기, 피부' },
      seoTitle: '질병 예방 운세 | 사주우주',
      seoDescription: '사주로 보는 질병 예방 가이드',
      seoKeywords: ['질병', '예방', '건강운'],
    },
    {
      templateSlug: 'vitality',
      title: '정신 건강 운세',
      slug: 'mental-health-fortune',
      excerpt: '마음의 안정을 위한 조언',
      data: { vitalityScore: 65, tips: '명상과 휴식으로 마음 다스리기' },
      seoTitle: '정신 건강 운세 | 사주우주',
      seoDescription: '정신 건강을 위한 사주 분석',
      seoKeywords: ['정신건강', '스트레스', '건강운'],
    },
    {
      templateSlug: 'health-caution',
      title: '수명과 장수 운',
      slug: 'longevity-fortune',
      excerpt: '건강하게 오래 살 수 있을까?',
      data: { healthAdvice: '균형 잡힌 생활 습관이 장수의 비결', weakPoints: '심장, 혈압' },
      seoTitle: '장수 운세 | 사주우주',
      seoDescription: '사주로 보는 장수와 건강 운세',
      seoKeywords: ['장수', '건강', '사주'],
    },
    {
      templateSlug: 'vitality',
      title: '스트레스 관리',
      slug: 'stress-management',
      excerpt: '스트레스 해소 방법은?',
      data: { vitalityScore: 60, tips: '자연 속 휴식과 취미 활동 추천' },
      seoTitle: '스트레스 관리 | 사주우주',
      seoDescription: '스트레스 해소를 위한 사주 조언',
      seoKeywords: ['스트레스', '힐링', '건강운'],
    },
  ],
  'monthly-fortune': [
    {
      templateSlug: 'this-month',
      title: '12월 운세',
      slug: 'december-2024',
      excerpt: '2024년 12월 종합 운세',
      data: { monthlyOverview: '한 해를 마무리하는 안정의 달', luckyDays: '5, 12, 21' },
      seoTitle: '12월 운세 | 사주우주',
      seoDescription: '2024년 12월 종합 운세를 확인하세요',
      seoKeywords: ['12월', '운세', '월간'],
    },
    {
      templateSlug: 'this-month',
      title: '1월 운세',
      slug: 'january-2025',
      excerpt: '2025년 1월 새해 운세',
      data: { monthlyOverview: '새로운 시작과 도전의 달', luckyDays: '1, 8, 15, 22' },
      seoTitle: '1월 운세 | 사주우주',
      seoDescription: '2025년 1월 새해 운세',
      seoKeywords: ['1월', '새해', '운세'],
    },
    {
      templateSlug: 'this-month',
      title: '2월 운세',
      slug: 'february-2025',
      excerpt: '2025년 2월 운세',
      data: { monthlyOverview: '인간관계가 중요한 달', luckyDays: '3, 14, 20' },
      seoTitle: '2월 운세 | 사주우주',
      seoDescription: '2025년 2월 종합 운세',
      seoKeywords: ['2월', '운세', '월간'],
    },
    {
      templateSlug: 'weekly',
      title: '이번 주 운세',
      slug: 'this-week',
      excerpt: '이번 주 운세를 확인하세요',
      data: { weeklyForecast: '주중 집중, 주말 휴식이 필요한 한 주' },
      seoTitle: '이번 주 운세 | 사주우주',
      seoDescription: '이번 주 종합 운세 확인',
      seoKeywords: ['주간', '운세', '이번주'],
    },
    {
      templateSlug: 'this-month',
      title: '3월 운세',
      slug: 'march-2025',
      excerpt: '2025년 3월 봄맞이 운세',
      data: { monthlyOverview: '새로운 기회가 찾아오는 달', luckyDays: '7, 14, 25' },
      seoTitle: '3월 운세 | 사주우주',
      seoDescription: '2025년 3월 봄 운세',
      seoKeywords: ['3월', '봄', '운세'],
    },
    {
      templateSlug: 'this-month',
      title: '상반기 운세',
      slug: 'first-half-2025',
      excerpt: '2025년 상반기 종합 운세',
      data: { monthlyOverview: '성장과 발전이 기대되는 상반기', luckyDays: '매월 첫째 주' },
      seoTitle: '상반기 운세 | 사주우주',
      seoDescription: '2025년 상반기 종합 운세 분석',
      seoKeywords: ['상반기', '2025', '운세'],
    },
  ],
  'compatibility': [
    {
      templateSlug: 'couple-match',
      title: '연인 궁합 분석',
      slug: 'love-compatibility',
      excerpt: '우리 커플의 궁합은?',
      data: { matchScore: 85, analysis: '불과 물의 조화로운 궁합' },
      seoTitle: '연인 궁합 | 사주우주',
      seoDescription: '연인과의 사주 궁합을 분석합니다',
      seoKeywords: ['궁합', '연인', '사주'],
    },
    {
      templateSlug: 'couple-match',
      title: '결혼 궁합',
      slug: 'marriage-compatibility',
      excerpt: '결혼 상대로서의 궁합은?',
      data: { matchScore: 78, analysis: '서로를 보완하는 좋은 궁합' },
      seoTitle: '결혼 궁합 | 사주우주',
      seoDescription: '결혼 상대와의 궁합을 분석합니다',
      seoKeywords: ['결혼', '궁합', '배우자'],
    },
    {
      templateSlug: 'friend-match',
      title: '친구 궁합',
      slug: 'friend-compatibility',
      excerpt: '친구와의 우정 궁합',
      data: { friendScore: 90, strengths: '서로를 이해하고 지지하는 관계' },
      seoTitle: '친구 궁합 | 사주우주',
      seoDescription: '친구와의 우정 궁합을 확인하세요',
      seoKeywords: ['친구', '우정', '궁합'],
    },
    {
      templateSlug: 'friend-match',
      title: '가족 궁합',
      slug: 'family-compatibility',
      excerpt: '가족과의 관계 분석',
      data: { friendScore: 75, strengths: '이해와 소통이 필요한 관계' },
      seoTitle: '가족 궁합 | 사주우주',
      seoDescription: '가족 간의 궁합을 분석합니다',
      seoKeywords: ['가족', '관계', '궁합'],
    },
    {
      templateSlug: 'couple-match',
      title: '소울메이트 찾기',
      slug: 'soulmate-finder',
      excerpt: '나의 소울메이트 특징은?',
      data: { matchScore: 95, analysis: '운명적인 만남이 예견됩니다' },
      seoTitle: '소울메이트 찾기 | 사주우주',
      seoDescription: '사주로 찾는 나의 소울메이트',
      seoKeywords: ['소울메이트', '운명', '인연'],
    },
    {
      templateSlug: 'friend-match',
      title: '동료 궁합',
      slug: 'colleague-compatibility',
      excerpt: '직장 동료와의 업무 궁합',
      data: { friendScore: 82, strengths: '협업에 강한 조합' },
      seoTitle: '동료 궁합 | 사주우주',
      seoDescription: '직장 동료와의 업무 궁합 분석',
      seoKeywords: ['동료', '업무', '궁합'],
    },
  ],
};

async function seedCategories() {
  console.log('→ 카테고리 시딩...');

  for (const category of CLIENT_CATEGORIES) {
    await prisma.sajuCategory.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        icon: category.icon,
        color: category.color,
        gradient: category.gradient,
        description: category.description,
        shortDesc: category.shortDesc,
        order: category.order,
        isActive: true,
      },
      create: {
        ...category,
        isActive: true,
      },
    });
    console.log(`  ✓ 카테고리: ${category.name} (${category.slug})`);
  }
}

async function seedTemplates() {
  console.log('→ 템플릿 시딩...');

  for (const [categorySlug, templates] of Object.entries(TEMPLATES_BY_CATEGORY)) {
    const category = await prisma.sajuCategory.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      console.warn(`  ⚠ 카테고리 ${categorySlug} 없음, 건너뜀`);
      continue;
    }

    for (const template of templates) {
      const existingTemplate = await prisma.sajuTemplate.findUnique({
        where: { slug: template.slug },
      });

      if (existingTemplate) {
        await prisma.sajuTemplate.update({
          where: { slug: template.slug },
          data: {
            name: template.name,
            description: template.description,
            type: template.type,
            layout: template.layout as Prisma.InputJsonValue,
            categoryId: category.id,
            isActive: true,
          },
        });
      } else {
        await prisma.sajuTemplate.create({
          data: {
            name: template.name,
            slug: template.slug,
            description: template.description,
            type: template.type,
            layout: template.layout as Prisma.InputJsonValue,
            categoryId: category.id,
            isActive: true,
          },
        });
      }

      // Create fields for template
      const createdTemplate = await prisma.sajuTemplate.findUnique({
        where: { slug: template.slug },
      });

      if (createdTemplate && template.fields) {
        // Delete existing fields
        await prisma.templateField.deleteMany({
          where: { templateId: createdTemplate.id },
        });

        // Create new fields
        for (let i = 0; i < template.fields.length; i++) {
          const field = template.fields[i];
          await prisma.templateField.create({
            data: {
              templateId: createdTemplate.id,
              name: field.name,
              type: field.type,
              label: field.label,
              validation: field.validation as Prisma.InputJsonValue || {},
              order: i + 1,
            },
          });
        }
      }

      console.log(`  ✓ 템플릿: ${template.name} (${categorySlug})`);
    }
  }
}

async function seedContents() {
  console.log('→ 콘텐츠 시딩...');

  for (const [categorySlug, contents] of Object.entries(CONTENTS_BY_CATEGORY)) {
    for (const content of contents) {
      const template = await prisma.sajuTemplate.findUnique({
        where: { slug: content.templateSlug },
      });

      if (!template) {
        console.warn(`  ⚠ 템플릿 ${content.templateSlug} 없음, 건너뜀`);
        continue;
      }

      const existingContent = await prisma.sajuContent.findUnique({
        where: { slug: content.slug },
      });

      if (existingContent) {
        await prisma.sajuContent.update({
          where: { slug: content.slug },
          data: {
            title: content.title,
            excerpt: content.excerpt,
            data: content.data as Prisma.InputJsonValue,
            seoTitle: content.seoTitle,
            seoDescription: content.seoDescription,
            seoKeywords: content.seoKeywords,
            status: 'published',
            publishedAt: new Date(),
          },
        });
      } else {
        await prisma.sajuContent.create({
          data: {
            templateId: template.id,
            title: content.title,
            slug: content.slug,
            excerpt: content.excerpt,
            data: content.data as Prisma.InputJsonValue,
            seoTitle: content.seoTitle,
            seoDescription: content.seoDescription,
            seoKeywords: content.seoKeywords,
            status: 'published',
            publishedAt: new Date(),
            viewCount: Math.floor(Math.random() * 500) + 50,
          },
        });
      }

      console.log(`  ✓ 콘텐츠: ${content.title} (${categorySlug})`);
    }
  }
}

async function main() {
  console.log('🚀 클라이언트 콘텐츠 시드 시작\n');

  await seedCategories();
  console.log('');
  await seedTemplates();
  console.log('');
  await seedContents();

  // Summary
  const categoryCount = await prisma.sajuCategory.count();
  const templateCount = await prisma.sajuTemplate.count();
  const contentCount = await prisma.sajuContent.count({ where: { status: 'published' } });

  console.log('\n✅ 시드 완료!');
  console.log(`   - 카테고리: ${categoryCount}개`);
  console.log(`   - 템플릿: ${templateCount}개`);
  console.log(`   - 콘텐츠: ${contentCount}개 (published)`);
}

main()
  .catch((error) => {
    console.error('❌ 시드 실패:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
