/**
 * Environment Variables 관리
 * 환경 변수를 타입 안전하게 관리하고 validation
 */

interface Env {
  siteUrl: string;
  kakaoAppKey?: string;
  gaId?: string;
  sentryDsn?: string;
  nodeEnv: 'development' | 'production' | 'test';
  isDevelopment: boolean;
  isProduction: boolean;
}

/**
 * 환경 변수 Validation
 */
function validateEnv(): Env {
  const nodeEnv = process.env.NODE_ENV || 'development';

  // NEXT_PUBLIC_SITE_URL은 필수는 아니지만 권장
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (nodeEnv === 'production'
      ? 'https://sajuwooju.me'
      : 'http://localhost:3005');

  return {
    siteUrl,
    kakaoAppKey: process.env.KAKAO_APP_KEY,
    gaId: process.env.NEXT_PUBLIC_GA_ID,
    sentryDsn: process.env.SENTRY_DSN,
    nodeEnv: nodeEnv as 'development' | 'production' | 'test',
    isDevelopment: nodeEnv === 'development',
    isProduction: nodeEnv === 'production',
  };
}

/**
 * Singleton instance
 */
export const env = validateEnv();

/**
 * Environment 정보 로깅 (development only)
 */
if (env.isDevelopment && typeof window === 'undefined') {
  console.log('🌍 Environment:', {
    nodeEnv: env.nodeEnv,
    siteUrl: env.siteUrl,
    hasKakaoKey: !!env.kakaoAppKey,
    hasGaId: !!env.gaId,
    hasSentryDsn: !!env.sentryDsn,
  });
}
