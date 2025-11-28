/**
 * Planet Textures Loading Hooks
 * NASA/Solar System Scope 텍스처를 로드하는 React Three Fiber 훅
 */

import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { useMemo } from 'react';
import { compressTexture } from '@/lib/texture-optimizer';

const TEXTURE_BASE_PATH = '/textures';

/**
 * Planet texture interface
 */
interface PlanetTextures {
  map: THREE.Texture;
  normalMap?: THREE.Texture;
  bumpMap?: THREE.Texture;
}

/**
 * Earth-specific textures (day, night, clouds)
 */
interface EarthTextures {
  dayMap: THREE.Texture;
  nightMap: THREE.Texture;
  cloudsMap: THREE.Texture;
}

/**
 * Configure texture for optimal quality and performance
 * Now uses texture-optimizer for consistent optimization
 */
function configureTexture(texture: THREE.Texture): THREE.Texture {
  return compressTexture(texture, {
    maxSize: 2048,
    anisotropy: 16,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
    magFilter: THREE.LinearFilter,
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.RepeatWrapping,
    encoding: THREE.SRGBColorSpace,
  });
}

/**
 * Load planet texture by english name
 *
 * @param englishName - Planet name (e.g., "earth", "mars", "jupiter")
 * @returns Planet textures
 *
 * @example
 * const { map } = usePlanetTextures('mars');
 * <meshStandardMaterial map={map} />
 */
export function usePlanetTextures(englishName: string): PlanetTextures {
  const map = useLoader(
    TextureLoader,
    `${TEXTURE_BASE_PATH}/${englishName}.jpg`
  );

  useMemo(() => {
    configureTexture(map);
  }, [map]);

  return { map };
}

/**
 * Load Earth-specific textures (day, night, clouds)
 *
 * @returns Earth textures (day, night, clouds)
 *
 * @example
 * const { dayMap, nightMap, cloudsMap } = useEarthTextures();
 * // Use in custom shader or Earth component
 */
export function useEarthTextures(): EarthTextures {
  const [dayMap, nightMap, cloudsMap] = useLoader(TextureLoader, [
    `${TEXTURE_BASE_PATH}/earth.jpg`,
    `${TEXTURE_BASE_PATH}/earthNight.jpg`,
    `${TEXTURE_BASE_PATH}/earthClouds.jpg`,
  ]);

  useMemo(() => {
    configureTexture(dayMap);
    configureTexture(nightMap);
    configureTexture(cloudsMap);
  }, [dayMap, nightMap, cloudsMap]);

  return { dayMap, nightMap, cloudsMap };
}

/**
 * Load Sun texture
 *
 * @returns Sun texture
 *
 * @example
 * const sunTexture = useSunTexture();
 * <meshStandardMaterial map={sunTexture} />
 */
export function useSunTexture(): THREE.Texture {
  const map = useLoader(TextureLoader, `${TEXTURE_BASE_PATH}/sun.jpg`);

  useMemo(() => {
    configureTexture(map);
  }, [map]);

  return map;
}

/**
 * Load Saturn ring texture (PNG with alpha channel)
 *
 * @returns Saturn ring texture
 *
 * @example
 * const ringTexture = useSaturnRingTexture();
 * <meshBasicMaterial map={ringTexture} transparent />
 */
export function useSaturnRingTexture(): THREE.Texture {
  const map = useLoader(TextureLoader, `${TEXTURE_BASE_PATH}/saturnRing.png`);

  useMemo(() => {
    configureTexture(map);
  }, [map]);

  return map;
}

/**
 * Preload all textures (call once at app start)
 * This prevents loading delays when switching between planets
 *
 * @example
 * // In your root component or _app.tsx
 * usePreloadTextures();
 */
export function usePreloadTextures() {
  useLoader(TextureLoader, [
    `${TEXTURE_BASE_PATH}/sun.jpg`,
    `${TEXTURE_BASE_PATH}/mercury.jpg`,
    `${TEXTURE_BASE_PATH}/venus.jpg`,
    `${TEXTURE_BASE_PATH}/earth.jpg`,
    `${TEXTURE_BASE_PATH}/earthNight.jpg`,
    `${TEXTURE_BASE_PATH}/earthClouds.jpg`,
    `${TEXTURE_BASE_PATH}/mars.jpg`,
    `${TEXTURE_BASE_PATH}/jupiter.jpg`,
    `${TEXTURE_BASE_PATH}/saturn.jpg`,
    `${TEXTURE_BASE_PATH}/saturnRing.png`,
    `${TEXTURE_BASE_PATH}/uranus.jpg`,
    `${TEXTURE_BASE_PATH}/neptune.jpg`,
  ]);
}
