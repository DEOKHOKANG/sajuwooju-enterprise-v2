import * as THREE from 'three';

/**
 * Texture Optimization Utilities
 * 텍스처 최적화 유틸리티
 *
 * Features:
 * - Texture compression
 * - Automatic resizing
 * - Anisotropic filtering
 * - Mipmap generation
 * - Memory usage calculation
 */

export interface TextureOptimizationOptions {
  /** Maximum texture dimension (width or height) */
  maxSize?: number;
  /** Anisotropic filtering samples (1, 2, 4, 8, 16) */
  anisotropy?: number;
  /** Enable mipmap generation */
  generateMipmaps?: boolean;
  /** Minification filter */
  minFilter?: THREE.MinificationTextureFilter;
  /** Magnification filter */
  magFilter?: THREE.MagnificationTextureFilter;
  /** Texture wrapping mode S (horizontal) */
  wrapS?: THREE.Wrapping;
  /** Texture wrapping mode T (vertical) */
  wrapT?: THREE.Wrapping;
  /** Texture color space */
  encoding?: typeof THREE.SRGBColorSpace;
}

export const DEFAULT_OPTIMIZATION_OPTIONS: TextureOptimizationOptions = {
  maxSize: 2048,
  anisotropy: 16,
  generateMipmaps: true,
  minFilter: THREE.LinearMipmapLinearFilter,
  magFilter: THREE.LinearFilter,
  wrapS: THREE.RepeatWrapping,
  wrapT: THREE.RepeatWrapping,
  encoding: THREE.SRGBColorSpace,
};

/**
 * Step 6.1.2: Compress Texture
 * Apply optimization settings to a texture
 */
export function compressTexture(
  texture: THREE.Texture,
  options: TextureOptimizationOptions = {}
): THREE.Texture {
  const opts = { ...DEFAULT_OPTIMIZATION_OPTIONS, ...options };

  // Apply anisotropic filtering
  texture.anisotropy = opts.anisotropy!;

  // Set filters
  texture.minFilter = opts.minFilter!;
  texture.magFilter = opts.magFilter!;

  // Set wrapping
  texture.wrapS = opts.wrapS!;
  texture.wrapT = opts.wrapT!;

  // Set encoding
  texture.colorSpace = opts.encoding!;

  // Generate mipmaps
  texture.generateMipmaps = opts.generateMipmaps!;

  // Force texture update
  texture.needsUpdate = true;

  return texture;
}

/**
 * Step 6.1.3: Resize Texture
 * Resize texture if it exceeds maximum dimensions
 * Note: This requires canvas API, typically done during texture loading
 */
export function getOptimalTextureSize(
  width: number,
  height: number,
  maxSize: number = 2048
): { width: number; height: number } {
  // If texture is within limits, return original size
  if (width <= maxSize && height <= maxSize) {
    return { width, height };
  }

  // Calculate aspect ratio
  const aspectRatio = width / height;

  // Scale down maintaining aspect ratio
  if (width > height) {
    return {
      width: maxSize,
      height: Math.floor(maxSize / aspectRatio),
    };
  } else {
    return {
      width: Math.floor(maxSize * aspectRatio),
      height: maxSize,
    };
  }
}

/**
 * Step 6.1.4: Optimize Anisotropic Filtering
 * Get optimal anisotropy value based on renderer capabilities
 */
export function getOptimalAnisotropy(renderer: THREE.WebGLRenderer): number {
  const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

  // Use 16 if supported, otherwise use max available
  return Math.min(16, maxAnisotropy);
}

/**
 * Step 6.1.5: Mipmap Generation
 * Configure mipmap generation based on texture size
 */
export function shouldGenerateMipmaps(width: number, height: number): boolean {
  // Only generate mipmaps for power-of-2 textures or if size > 512
  const isPowerOfTwo = (n: number) => (n & (n - 1)) === 0;

  if (isPowerOfTwo(width) && isPowerOfTwo(height)) {
    return true;
  }

  // For non-power-of-2 textures, only generate if large enough
  return width >= 512 || height >= 512;
}

/**
 * Step 6.1.6: Calculate Texture Memory Usage
 * Estimate GPU memory usage for a texture
 */
export function calculateTextureMemory(texture: THREE.Texture): number {
  const image = texture.image as HTMLImageElement | HTMLCanvasElement | undefined;

  if (!image || !('width' in image) || !('height' in image)) {
    return 0;
  }

  const width = image.width;
  const height = image.height;

  // Base memory: width * height * bytes per pixel
  // Assume 4 bytes per pixel (RGBA)
  let memory = width * height * 4;

  // If mipmaps are generated, add ~33% more memory
  if (texture.generateMipmaps) {
    memory *= 1.33;
  }

  return memory; // in bytes
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Optimize all textures in a scene
 */
export function optimizeSceneTextures(
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  options: TextureOptimizationOptions = {}
): void {
  const anisotropy = getOptimalAnisotropy(renderer);
  const opts = { ...DEFAULT_OPTIMIZATION_OPTIONS, anisotropy, ...options };

  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      const material = object.material;

      if (Array.isArray(material)) {
        material.forEach((mat) => optimizeMaterial(mat, opts));
      } else {
        optimizeMaterial(material, opts);
      }
    }
  });
}

/**
 * Optimize material textures
 */
function optimizeMaterial(
  material: THREE.Material,
  options: TextureOptimizationOptions
): void {
  if (material instanceof THREE.MeshStandardMaterial) {
    if (material.map) compressTexture(material.map, options);
    if (material.normalMap) compressTexture(material.normalMap, options);
    if (material.roughnessMap) compressTexture(material.roughnessMap, options);
    if (material.metalnessMap) compressTexture(material.metalnessMap, options);
    if (material.aoMap) compressTexture(material.aoMap, options);
    if (material.emissiveMap) compressTexture(material.emissiveMap, options);
  } else if (material instanceof THREE.MeshBasicMaterial) {
    if (material.map) compressTexture(material.map, options);
  }
}

/**
 * Get total texture memory for a scene
 */
export function getTotalSceneTextureMemory(scene: THREE.Scene): number {
  let totalMemory = 0;
  const processedTextures = new Set<THREE.Texture>();

  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      const material = object.material;

      if (Array.isArray(material)) {
        material.forEach((mat) => {
          totalMemory += getMaterialTextureMemory(mat, processedTextures);
        });
      } else {
        totalMemory += getMaterialTextureMemory(material, processedTextures);
      }
    }
  });

  return totalMemory;
}

/**
 * Get material texture memory
 */
function getMaterialTextureMemory(
  material: THREE.Material,
  processedTextures: Set<THREE.Texture>
): number {
  let memory = 0;

  if (material instanceof THREE.MeshStandardMaterial) {
    const textures = [
      material.map,
      material.normalMap,
      material.roughnessMap,
      material.metalnessMap,
      material.aoMap,
      material.emissiveMap,
    ].filter((t): t is THREE.Texture => t !== null);

    textures.forEach((texture) => {
      if (!processedTextures.has(texture)) {
        memory += calculateTextureMemory(texture);
        processedTextures.add(texture);
      }
    });
  } else if (material instanceof THREE.MeshBasicMaterial && material.map) {
    if (!processedTextures.has(material.map)) {
      memory += calculateTextureMemory(material.map);
      processedTextures.add(material.map);
    }
  }

  return memory;
}
