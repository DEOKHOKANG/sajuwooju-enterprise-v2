/**
 * Planet Data Type (3D component removed for optimization)
 */
export interface PlanetData {
  name: string;
  englishName: string;
  element: string;
  color: string;
  radius: number;
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
  description: string;
  hasAtmosphere: boolean;
  hasRings?: boolean;
  zodiacPalace: string;
  isPremium: boolean;
}

/**
 * 행성 데이터 - 음양오행 매핑
 * Planets Data with Five Elements (Wu Xing) Mapping
 *
 * 수금지화목토천해명 (9 planets)
 * 음양오행: 水 (Water), 金 (Metal), 土 (Earth), 火 (Fire), 木 (Wood)
 */

export const PLANETS_DATA: PlanetData[] = [
  // 太陽 (Sun) - 생명, 자아, 중심
  {
    name: '태양',
    englishName: 'sun',
    element: '火',
    color: '#FFE66D',
    radius: 20,
    orbitRadius: 0, // 중심에 위치
    orbitSpeed: 0,
    rotationSpeed: 0.001,
    description: '태양은 火의 중심 에너지로 생명과 자아를 상징합니다.',
    hasAtmosphere: false,
    zodiacPalace: 'life', // 명궁 - 생명과 자아
    isPremium: false, // 무료 - 기본 정보
  },

  // 水 (Water) - 흐름, 지혜, 유연성
  {
    name: '수성',
    englishName: 'mercury',
    element: '水',
    color: '#B8C5D6',
    radius: 3,
    orbitRadius: 50,
    orbitSpeed: 4.74, // Mercury's orbital speed (km/s)
    rotationSpeed: 0.02,
    description: '수성은 水(물)의 기운을 가진 행성입니다. 빠르고 유연한 지혜를 상징합니다.',
    hasAtmosphere: false,
    zodiacPalace: 'travel', // 천이궁 - 이동과 소통
    isPremium: true,
  },
  {
    name: '천왕성',
    englishName: 'uranus',
    element: '水',
    color: '#4FD0E7',
    radius: 8,
    orbitRadius: 210,
    orbitSpeed: 0.68,
    rotationSpeed: 0.015,
    description: '천왕성은 水의 혁신적 에너지를 담고 있습니다.',
    hasAtmosphere: true,
    zodiacPalace: 'parents', // 부모궁 - 권위와 전통
    isPremium: false, // 무료
  },
  {
    name: '해왕성',
    englishName: 'neptune',
    element: '水',
    color: '#4169E1',
    radius: 8,
    orbitRadius: 240,
    orbitSpeed: 0.54,
    rotationSpeed: 0.014,
    description: '해왕성은 水의 깊은 영성과 직관을 나타냅니다.',
    hasAtmosphere: true,
    zodiacPalace: 'health', // 질액궁 - 건강과 치유
    isPremium: true,
  },

  // 金 (Metal) - 단단함, 정의, 결단
  {
    name: '금성',
    englishName: 'venus',
    element: '金',
    color: '#FFD700',
    radius: 6,
    orbitRadius: 70,
    orbitSpeed: 3.5, // Venus's orbital speed
    rotationSpeed: 0.005,
    description: '금성은 金(금속)의 기운으로 사랑과 아름다움을 상징합니다.',
    hasAtmosphere: true,
    zodiacPalace: 'spouse', // 부부궁 - 사랑과 결혼
    isPremium: true,
  },

  // 土 (Earth) - 안정, 중심, 포용
  {
    name: '지구',
    englishName: 'earth',
    element: '土',
    color: '#4169E1',
    radius: 6,
    orbitRadius: 90,
    orbitSpeed: 2.98, // Earth's orbital speed
    rotationSpeed: 0.02,
    description: '지구는 土(흙)의 중심 에너지를 가진 우리의 고향입니다.',
    hasAtmosphere: true,
    zodiacPalace: 'wealth', // 재백궁 - 재물과 물질
    isPremium: true,
  },
  {
    name: '토성',
    englishName: 'saturn',
    element: '土',
    color: '#DAA520',
    radius: 20, // Iteration 8: 25 → 20 (smaller, more balanced size)
    orbitRadius: 180,
    orbitSpeed: 0.97,
    rotationSpeed: 0.025,
    description: '토성은 土의 안정과 책임을 상징하는 큰 행성입니다.',
    hasAtmosphere: true,
    hasRings: true,
    zodiacPalace: 'servants', // 노복궁 - 지원과 협력
    isPremium: false, // 무료
  },
  {
    name: '명왕성',
    englishName: 'pluto',
    element: '土',
    color: '#8B7355',
    radius: 2,
    orbitRadius: 270,
    orbitSpeed: 0.47,
    rotationSpeed: 0.008,
    description: '명왕성은 土의 변화와 재생을 나타냅니다.',
    hasAtmosphere: false,
    zodiacPalace: 'property', // 전택궁 - 재산과 주거
    isPremium: true,
  },

  // 火 (Fire) - 열정, 에너지, 변화
  {
    name: '화성',
    englishName: 'mars',
    element: '火',
    color: '#DC143C',
    radius: 4,
    orbitRadius: 110,
    orbitSpeed: 2.41, // Mars's orbital speed
    rotationSpeed: 0.02,
    description: '화성은 火(불)의 열정과 용기를 상징합니다.',
    hasAtmosphere: true,
    zodiacPalace: 'children', // 자녀궁 - 창조와 열정
    isPremium: true,
  },

  // 木 (Wood) - 성장, 확장, 생명력
  {
    name: '목성',
    englishName: 'jupiter',
    element: '木',
    color: '#FF8C00',
    radius: 11,
    orbitRadius: 150,
    orbitSpeed: 1.31, // Jupiter's orbital speed
    rotationSpeed: 0.04,
    description: '목성은 木(나무)의 성장과 확장을 상징하는 가장 큰 행성입니다.',
    hasAtmosphere: true,
    zodiacPalace: 'happiness', // 복덕궁 - 행복과 복
    isPremium: true,
  },
];

/**
 * 음양오행 별 행성 그룹
 * Planets grouped by Five Elements
 */
export const PLANETS_BY_ELEMENT = {
  水: PLANETS_DATA.filter((p) => p.element === '水'), // Water: Mercury, Uranus, Neptune
  金: PLANETS_DATA.filter((p) => p.element === '金'), // Metal: Venus
  土: PLANETS_DATA.filter((p) => p.element === '土'), // Earth: Earth, Saturn, Pluto
  火: PLANETS_DATA.filter((p) => p.element === '火'), // Fire: Mars
  木: PLANETS_DATA.filter((p) => p.element === '木'), // Wood: Jupiter
};

/**
 * 오행 색상 매핑
 * Five Elements Color Mapping
 */
export const ELEMENT_COLORS = {
  水: '#4FD0E7', // Cyan
  金: '#FFD700', // Gold
  土: '#DAA520', // Goldenrod
  火: '#DC143C', // Crimson
  木: '#FF8C00', // Dark Orange
};

/**
 * 오행 설명
 * Five Elements Descriptions
 */
export const ELEMENT_DESCRIPTIONS = {
  水: {
    name: '수(水)',
    meaning: '물',
    traits: ['지혜', '유연성', '흐름', '적응력'],
    description: '물처럼 흐르는 지혜와 변화에 대한 적응력을 상징합니다.',
  },
  金: {
    name: '금(金)',
    meaning: '금속',
    traits: ['단단함', '정의', '결단', '명예'],
    description: '금속처럼 단단한 의지와 명확한 판단력을 나타냅니다.',
  },
  土: {
    name: '토(土)',
    meaning: '흙',
    traits: ['안정', '중심', '포용', '신뢰'],
    description: '대지처럼 안정적이고 포용력 있는 에너지를 담고 있습니다.',
  },
  火: {
    name: '화(火)',
    meaning: '불',
    traits: ['열정', '에너지', '변화', '창조'],
    description: '불처럼 뜨거운 열정과 창조적 에너지를 상징합니다.',
  },
  木: {
    name: '목(木)',
    meaning: '나무',
    traits: ['성장', '확장', '생명력', '발전'],
    description: '나무처럼 꾸준히 성장하고 확장하는 힘을 나타냅니다.',
  },
};

/**
 * Get planet by name
 */
export function getPlanetByName(name: string): PlanetData | undefined {
  return PLANETS_DATA.find((p) => p.name === name);
}

/**
 * Get planets by element
 */
export function getPlanetsByElement(
  element: '水' | '金' | '土' | '火' | '木'
): PlanetData[] {
  return PLANETS_BY_ELEMENT[element];
}

/**
 * Get premium planets
 */
export function getPremiumPlanets(): PlanetData[] {
  return PLANETS_DATA.filter((p) => p.isPremium === true);
}

/**
 * Get free planets
 */
export function getFreePlanets(): PlanetData[] {
  return PLANETS_DATA.filter((p) => p.isPremium === false);
}

/**
 * Check if planet is premium
 */
export function isPlanetPremium(planetName: string): boolean {
  const planet = PLANETS_DATA.find((p) => p.name === planetName || p.englishName === planetName);
  return planet?.isPremium === true;
}
