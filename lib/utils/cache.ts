/**
 * 캐싱 유틸리티
 *
 * 메모리 기반 캐싱 (프로덕션에서는 Redis 사용 권장)
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // 5분마다 만료된 항목 정리
    this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * 캐시에 값 설정
   */
  set<T>(key: string, value: T, ttlSeconds: number = 300): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { value, expiresAt });
  }

  /**
   * 캐시에서 값 가져오기
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // 만료 확인
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  /**
   * 캐시 키 존재 확인
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    // 만료 확인
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * 캐시에서 값 삭제
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * 패턴에 맞는 캐시 키 모두 삭제
   */
  deletePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * 모든 캐시 삭제
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * 만료된 항목 정리
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * 캐시 크기 가져오기
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * 캐시 통계
   */
  stats(): {
    size: number;
    keys: string[];
    memoryUsage: number;
  } {
    const keys = Array.from(this.cache.keys());
    const memoryUsage = JSON.stringify(Array.from(this.cache.entries())).length;

    return {
      size: this.cache.size,
      keys,
      memoryUsage,
    };
  }

  /**
   * 정리 타이머 중지 (테스트용)
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.clear();
  }
}

// 싱글톤 인스턴스
export const cache = new MemoryCache();

/**
 * 캐시 키 생성 헬퍼
 */
export function createCacheKey(...parts: (string | number | boolean | null | undefined)[]): string {
  return parts
    .filter((part) => part !== null && part !== undefined)
    .map((part) => String(part))
    .join(':');
}

/**
 * 함수 결과 캐싱 데코레이터
 */
export function withCache<T>(
  fn: (...args: any[]) => Promise<T>,
  options: {
    keyGenerator: (...args: any[]) => string;
    ttlSeconds?: number;
  }
): (...args: any[]) => Promise<T> {
  return async (...args: any[]): Promise<T> => {
    const key = options.keyGenerator(...args);
    const cached = cache.get<T>(key);

    if (cached !== null) {
      return cached;
    }

    const result = await fn(...args);
    cache.set(key, result, options.ttlSeconds);

    return result;
  };
}

/**
 * 카테고리 캐시 키
 */
export const CategoryCacheKeys = {
  all: () => createCacheKey('categories', 'all'),
  byId: (id: string) => createCacheKey('categories', 'id', id),
  bySlug: (slug: string) => createCacheKey('categories', 'slug', slug),
  list: (page: number, limit: number, search?: string) =>
    createCacheKey('categories', 'list', page, limit, search),
  invalidate: () => cache.deletePattern('^categories:'),
};

/**
 * 제품 캐시 키
 */
export const ProductCacheKeys = {
  all: () => createCacheKey('products', 'all'),
  byId: (id: string) => createCacheKey('products', 'id', id),
  bySlug: (slug: string) => createCacheKey('products', 'slug', slug),
  list: (page: number, limit: number, categoryId?: string, search?: string) =>
    createCacheKey('products', 'list', page, limit, categoryId, search),
  featured: () => createCacheKey('products', 'featured'),
  invalidate: () => cache.deletePattern('^products:'),
};

/**
 * 사용자 캐시 키
 */
export const UserCacheKeys = {
  byId: (id: string) => createCacheKey('users', 'id', id),
  byEmail: (email: string) => createCacheKey('users', 'email', email),
  list: (page: number, limit: number) => createCacheKey('users', 'list', page, limit),
  invalidate: () => cache.deletePattern('^users:'),
};

/**
 * 분석 캐시 키
 */
export const AnalysisCacheKeys = {
  byId: (id: string) => createCacheKey('analyses', 'id', id),
  bySessionId: (sessionId: string) => createCacheKey('analyses', 'session', sessionId),
  list: (page: number, limit: number) => createCacheKey('analyses', 'list', page, limit),
  invalidate: () => cache.deletePattern('^analyses:'),
};

/**
 * 통계 캐시 키
 */
export const StatsCacheKeys = {
  dashboard: () => createCacheKey('stats', 'dashboard'),
  categories: () => createCacheKey('stats', 'categories'),
  products: () => createCacheKey('stats', 'products'),
  users: () => createCacheKey('stats', 'users'),
  invalidateAll: () => cache.deletePattern('^stats:'),
};

/**
 * 캐시 무효화 헬퍼
 */
export const CacheInvalidation = {
  /**
   * 카테고리 관련 캐시 무효화
   */
  category: () => {
    CategoryCacheKeys.invalidate();
    ProductCacheKeys.invalidate(); // 제품이 카테고리를 참조하므로
    StatsCacheKeys.invalidateAll();
  },

  /**
   * 제품 관련 캐시 무효화
   */
  product: () => {
    ProductCacheKeys.invalidate();
    StatsCacheKeys.invalidateAll();
  },

  /**
   * 사용자 관련 캐시 무효화
   */
  user: () => {
    UserCacheKeys.invalidate();
    StatsCacheKeys.invalidateAll();
  },

  /**
   * 분석 관련 캐시 무효화
   */
  analysis: () => {
    AnalysisCacheKeys.invalidate();
    StatsCacheKeys.invalidateAll();
  },

  /**
   * 모든 캐시 무효화
   */
  all: () => {
    cache.clear();
  },
};
