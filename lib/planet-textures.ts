/**
 * Planet Texture Configuration
 * NASA/Solar System Scope 텍스처 설정
 */

export interface PlanetTextures {
  map?: string; // Diffuse/Color map
  normalMap?: string; // Normal map for surface detail
  bumpMap?: string; // Bump map for height
  specularMap?: string; // Specular map for shininess
  emissiveMap?: string; // Emissive map for glow
  displacementMap?: string; // Displacement for actual geometry
  roughnessMap?: string; // Roughness variation
  metalnessMap?: string; // Metalness variation
}

/**
 * Planet texture URLs
 * For production: Replace with actual NASA/Solar System Scope textures
 * For now: Use procedural/gradient textures
 */
export const PLANET_TEXTURE_URLS: Record<string, PlanetTextures> = {
  // 태양 Sun
  sun: {
    map: '/textures/sun_diffuse.jpg',
    emissiveMap: '/textures/sun_emissive.jpg',
  },

  // 수성 Mercury
  mercury: {
    map: '/textures/mercury_diffuse.jpg',
    bumpMap: '/textures/mercury_bump.jpg',
  },

  // 금성 Venus
  venus: {
    map: '/textures/venus_diffuse.jpg',
    bumpMap: '/textures/venus_bump.jpg',
  },

  // 지구 Earth
  earth: {
    map: '/textures/earth_day.jpg',
    normalMap: '/textures/earth_normal.jpg',
    specularMap: '/textures/earth_specular.jpg',
    bumpMap: '/textures/earth_bump.jpg',
  },

  // 화성 Mars
  mars: {
    map: '/textures/mars_diffuse.jpg',
    bumpMap: '/textures/mars_bump.jpg',
  },

  // 목성 Jupiter
  jupiter: {
    map: '/textures/jupiter_diffuse.jpg',
  },

  // 토성 Saturn
  saturn: {
    map: '/textures/saturn_diffuse.jpg',
  },

  // 천왕성 Uranus
  uranus: {
    map: '/textures/uranus_diffuse.jpg',
  },

  // 해왕성 Neptune
  neptune: {
    map: '/textures/neptune_diffuse.jpg',
  },
};

/**
 * Fallback: Procedural textures using gradients
 * 실제 텍스처 파일이 없을 경우 사용
 */
export const PROCEDURAL_TEXTURES: Record<string, { color: string; secondaryColor?: string }> = {
  sun: { color: '#FDB813', secondaryColor: '#FFE66D' },
  mercury: { color: '#8C7853', secondaryColor: '#B8A896' },
  venus: { color: '#FFC649', secondaryColor: '#E8B04B' },
  earth: { color: '#4169E1', secondaryColor: '#228B22' },
  mars: { color: '#DC143C', secondaryColor: '#CD853F' },
  jupiter: { color: '#FF8C00', secondaryColor: '#FFA500' },
  saturn: { color: '#FFD700', secondaryColor: '#F4E4C1' },
  uranus: { color: '#4FD0E7', secondaryColor: '#8FD8E8' },
  neptune: { color: '#4169E1', secondaryColor: '#5B9BD5' },
};

/**
 * Texture download guide
 * 실제 프로덕션용 고품질 텍스처 다운로드 가이드
 */
export const TEXTURE_DOWNLOAD_SOURCES = {
  nasa: {
    url: 'https://nasa3d.arc.nasa.gov/models',
    description: 'NASA 공식 3D 모델 및 텍스처 (GLTF, 4K 텍스처)',
    planets: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
  },
  solarSystemScope: {
    url: 'https://www.solarsystemscope.com/textures/',
    description: '고품질 행성 텍스처 (2K, 4K, 8K)',
    planets: ['All planets'],
    license: 'Free for non-commercial use',
  },
  planetPixelEmporium: {
    url: 'http://planetpixelemporium.com/planets.html',
    description: '상세한 행성 텍스처 맵 (diffuse, bump, specular)',
    planets: ['All planets', 'Moons'],
  },
};

/**
 * Recommended texture resolutions
 * 성능과 품질의 균형
 */
export const TEXTURE_RESOLUTIONS = {
  desktop: {
    sun: '4K (4096x2048)',
    major_planets: '4K (4096x2048)', // Earth, Jupiter, Saturn
    minor_planets: '2K (2048x1024)', // Mercury, Venus, Mars, Uranus, Neptune
  },
  mobile: {
    sun: '2K (2048x1024)',
    major_planets: '2K (2048x1024)',
    minor_planets: '1K (1024x512)',
  },
};
