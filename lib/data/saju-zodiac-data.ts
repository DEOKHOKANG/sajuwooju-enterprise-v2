/**
 * Saju Zodiac Palace Data (십이궁 - 12궁)
 * Maps the 12 life palaces to planetary positions and Five Elements
 * 사주 12궁과 행성, 오행 매핑 데이터
 */

export type FiveElements = 'wood' | 'fire' | 'earth' | 'metal' | 'water';
export type ZodiacPalace =
  | 'life' // 명궁 (命宮)
  | 'siblings' // 형제궁 (兄弟宮)
  | 'spouse' // 부부궁 (夫婦宮)
  | 'children' // 자녀궁 (子女宮)
  | 'wealth' // 재백궁 (財帛宮)
  | 'health' // 질액궁 (疾厄宮)
  | 'travel' // 천이궁 (遷移宮)
  | 'servants' // 노복궁 (奴僕宮)
  | 'career' // 관록궁 (官祿宮)
  | 'property' // 전택궁 (田宅宮)
  | 'happiness' // 복덕궁 (福德宮)
  | 'parents'; // 부모궁 (父母宮)

/**
 * Five Elements Properties
 * 오행 속성 및 색상
 */
export const FIVE_ELEMENTS_DATA = {
  wood: {
    element: 'wood' as FiveElements,
    name: '목 (木)',
    nameEn: 'Wood',
    color: '#4ADE80', // Green
    colorDark: '#166534',
    planet: 'Jupiter', // 목성
    characteristics: ['성장', '발전', '창의', '확장'],
    emoji: '🌱',
  },
  fire: {
    element: 'fire' as FiveElements,
    name: '화 (火)',
    nameEn: 'Fire',
    color: '#F87171', // Red
    colorDark: '#991B1B',
    planet: 'Mars', // 화성
    characteristics: ['열정', '활력', '변화', '창조'],
    emoji: '🔥',
  },
  earth: {
    element: 'earth' as FiveElements,
    name: '토 (土)',
    nameEn: 'Earth',
    color: '#FBBF24', // Yellow/Gold
    colorDark: '#92400E',
    planet: 'Saturn', // 토성
    characteristics: ['안정', '중심', '신뢰', '기반'],
    emoji: '🌍',
  },
  metal: {
    element: 'metal' as FiveElements,
    name: '금 (金)',
    nameEn: 'Metal',
    color: '#E5E5E5', // White/Silver
    colorDark: '#525252',
    planet: 'Venus', // 금성
    characteristics: ['강함', '결단', '명예', '권위'],
    emoji: '⚔️',
  },
  water: {
    element: 'water' as FiveElements,
    name: '수 (水)',
    nameEn: 'Water',
    color: '#60A5FA', // Blue
    colorDark: '#1E3A8A',
    planet: 'Mercury', // 수성
    characteristics: ['지혜', '유연', '소통', '흐름'],
    emoji: '💧',
  },
} as const;

/**
 * 12 Zodiac Palaces Data
 * 십이궁 상세 데이터
 */
export const ZODIAC_PALACES_DATA = {
  life: {
    palace: 'life' as ZodiacPalace,
    name: '명궁 (命宮)',
    nameEn: 'Life Palace',
    description: '개인의 타고난 성격, 외모, 기질을 나타내는 궁',
    element: 'fire' as FiveElements,
    planet: 'Sun', // 태양 - 자아, 생명력
    position: 0, // Orbital position (degrees)
    isPremium: false, // 무료 컨텐츠
    interpretation: {
      title: '당신의 본질',
      description: '타고난 성격과 삶의 방향성을 보여줍니다.',
      keywords: ['성격', '외모', '기질', '자아'],
    },
  },
  siblings: {
    palace: 'siblings' as ZodiacPalace,
    name: '형제궁 (兄弟宮)',
    nameEn: 'Siblings Palace',
    description: '형제자매, 친구, 동료와의 관계',
    element: 'wood' as FiveElements,
    planet: 'Jupiter', // 목성 - 확장, 관계
    position: 30,
    isPremium: true,
    interpretation: {
      title: '인간관계의 확장',
      description: '주변 사람들과의 인연을 풀이합니다.',
      keywords: ['형제', '친구', '동료', '인연'],
    },
  },
  spouse: {
    palace: 'spouse' as ZodiacPalace,
    name: '부부궁 (夫婦宮)',
    nameEn: 'Spouse Palace',
    description: '배우자, 연애, 결혼 운',
    element: 'metal' as FiveElements,
    planet: 'Venus', // 금성 - 사랑, 관계
    position: 60,
    isPremium: true,
    interpretation: {
      title: '사랑과 결혼',
      description: '연애운과 배우자와의 궁합을 봅니다.',
      keywords: ['연애', '결혼', '배우자', '사랑'],
    },
  },
  children: {
    palace: 'children' as ZodiacPalace,
    name: '자녀궁 (子女宮)',
    nameEn: 'Children Palace',
    description: '자녀운, 창작, 자기표현',
    element: 'fire' as FiveElements,
    planet: 'Mars', // 화성 - 창조, 열정
    position: 90,
    isPremium: true,
    interpretation: {
      title: '창조와 자손',
      description: '자녀운과 창작 에너지를 해석합니다.',
      keywords: ['자녀', '창작', '표현', '열정'],
    },
  },
  wealth: {
    palace: 'wealth' as ZodiacPalace,
    name: '재백궁 (財帛宮)',
    nameEn: 'Wealth Palace',
    description: '재물운, 수입, 경제 상태',
    element: 'earth' as FiveElements,
    planet: 'Earth', // 지구 - 물질, 안정
    position: 120,
    isPremium: true,
    interpretation: {
      title: '재물과 번영',
      description: '금전운과 재물 축적의 가능성을 봅니다.',
      keywords: ['재물', '수입', '번영', '안정'],
    },
  },
  health: {
    palace: 'health' as ZodiacPalace,
    name: '질액궁 (疾厄宮)',
    nameEn: 'Health Palace',
    description: '건강, 질병, 체질',
    element: 'water' as FiveElements,
    planet: 'Neptune', // 해왕성 - 치유, 건강 (또는 Moon도 가능)
    position: 150,
    isPremium: true,
    interpretation: {
      title: '건강과 체질',
      description: '건강 상태와 주의할 질병을 알려줍니다.',
      keywords: ['건강', '질병', '체질', '치유'],
    },
  },
  travel: {
    palace: 'travel' as ZodiacPalace,
    name: '천이궁 (遷移宮)',
    nameEn: 'Travel Palace',
    description: '이동, 여행, 해외운',
    element: 'water' as FiveElements,
    planet: 'Mercury', // 수성 - 이동, 소통
    position: 180,
    isPremium: true,
    interpretation: {
      title: '이동과 변화',
      description: '여행운과 환경 변화의 길흉을 봅니다.',
      keywords: ['여행', '이동', '해외', '변화'],
    },
  },
  servants: {
    palace: 'servants' as ZodiacPalace,
    name: '노복궁 (奴僕宮)',
    nameEn: 'Servants Palace',
    description: '부하, 후배, 지원자',
    element: 'earth' as FiveElements,
    planet: 'Saturn', // 토성 - 책임, 구조
    position: 210,
    isPremium: false, // 무료
    interpretation: {
      title: '지원과 협력',
      description: '주변의 도움과 협력 관계를 해석합니다.',
      keywords: ['부하', '지원', '협력', '도움'],
    },
  },
  career: {
    palace: 'career' as ZodiacPalace,
    name: '관록궁 (官祿宮)',
    nameEn: 'Career Palace',
    description: '직업, 사회적 지위, 명예',
    element: 'fire' as FiveElements,
    planet: 'Sun', // 태양 - 명예, 권위
    position: 240,
    isPremium: true,
    interpretation: {
      title: '직업과 명예',
      description: '커리어 발전과 사회적 성공을 봅니다.',
      keywords: ['직업', '지위', '명예', '성공'],
    },
  },
  property: {
    palace: 'property' as ZodiacPalace,
    name: '전택궁 (田宅宮)',
    nameEn: 'Property Palace',
    description: '부동산, 주거, 가정 환경',
    element: 'earth' as FiveElements,
    planet: 'Moon', // 달 - 가정, 안식처 (또는 지구)
    position: 270,
    isPremium: true,
    interpretation: {
      title: '재산과 주거',
      description: '부동산운과 가정 환경을 해석합니다.',
      keywords: ['부동산', '주거', '가정', '재산'],
    },
  },
  happiness: {
    palace: 'happiness' as ZodiacPalace,
    name: '복덕궁 (福德宮)',
    nameEn: 'Happiness Palace',
    description: '복, 정신적 만족, 취미',
    element: 'wood' as FiveElements,
    planet: 'Jupiter', // 목성 - 행운, 확장
    position: 300,
    isPremium: true,
    interpretation: {
      title: '행복과 복',
      description: '정신적 만족과 행복의 가능성을 봅니다.',
      keywords: ['복', '행복', '취미', '만족'],
    },
  },
  parents: {
    palace: 'parents' as ZodiacPalace,
    name: '부모궁 (父母宮)',
    nameEn: 'Parents Palace',
    description: '부모, 윗사람, 멘토',
    element: 'metal' as FiveElements,
    planet: 'Uranus', // 천왕성 - 권위, 전통 (또는 Venus)
    position: 330,
    isPremium: false, // 무료
    interpretation: {
      title: '부모와 은혜',
      description: '부모와의 관계와 윗사람의 도움을 봅니다.',
      keywords: ['부모', '윗사람', '멘토', '은혜'],
    },
  },
} as const;

/**
 * Get zodiac palace by planet name
 */
export function getZodiacByPlanet(planetName: string): (typeof ZODIAC_PALACES_DATA)[ZodiacPalace] | null {
  const palace = Object.values(ZODIAC_PALACES_DATA).find((p) => p.planet === planetName);
  return palace || null;
}

/**
 * Get all premium palaces
 */
export function getPremiumPalaces() {
  return Object.values(ZODIAC_PALACES_DATA).filter((p) => p.isPremium);
}

/**
 * Get all free palaces
 */
export function getFreePalaces() {
  return Object.values(ZODIAC_PALACES_DATA).filter((p) => !p.isPremium);
}

/**
 * Get palaces by Five Element
 */
export function getPalacesByElement(element: FiveElements) {
  return Object.values(ZODIAC_PALACES_DATA).filter((p) => p.element === element);
}
