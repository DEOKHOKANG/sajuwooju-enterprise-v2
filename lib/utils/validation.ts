/**
 * 입력 검증 및 새니타이제이션 유틸리티
 *
 * XSS, SQL Injection 등의 공격 방지
 */

import { z } from 'zod';

/**
 * HTML 특수 문자 이스케이프
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * SQL Injection 위험 문자 제거
 */
export function sanitizeSql(input: string): string {
  // Prisma ORM을 사용하므로 기본적으로 SQL Injection에 안전하지만,
  // raw query 사용 시를 대비한 추가 보안
  return input.replace(/['";\\]/g, '');
}

/**
 * 파일명 새니타이제이션
 */
export function sanitizeFilename(filename: string): string {
  // 위험한 문자 제거
  return filename
    .replace(/[^a-zA-Z0-9가-힣._-]/g, '_')
    .replace(/\.{2,}/g, '.') // 연속된 점 제거
    .replace(/^\.+/, '') // 시작 점 제거
    .slice(0, 255); // 최대 길이 제한
}

/**
 * URL 검증
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * 이메일 검증
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 한글 이름 검증
 */
export function isValidKoreanName(name: string): boolean {
  const nameRegex = /^[가-힣]{2,10}$/;
  return nameRegex.test(name);
}

/**
 * 전화번호 검증 (한국)
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
  return phoneRegex.test(phone);
}

/**
 * Slug 검증 (URL 친화적)
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * 비밀번호 강도 검증
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('비밀번호는 최소 8자 이상이어야 합니다.');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('대문자를 최소 1개 포함해야 합니다.');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('소문자를 최소 1개 포함해야 합니다.');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('숫자를 최소 1개 포함해야 합니다.');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('특수문자를 최소 1개 포함해야 합니다.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Zod 스키마 - 카테고리 생성/수정
 */
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, '카테고리 이름은 필수입니다.')
    .max(50, '카테고리 이름은 50자를 초과할 수 없습니다.'),
  slug: z
    .string()
    .min(1, 'Slug는 필수입니다.')
    .max(100, 'Slug는 100자를 초과할 수 없습니다.')
    .regex(/^[a-z0-9-]+$/, 'Slug는 소문자, 숫자, 하이픈만 사용할 수 있습니다.'),
  description: z
    .string()
    .max(500, '설명은 500자를 초과할 수 없습니다.')
    .optional(),
  icon: z.string().max(10, '아이콘은 10자를 초과할 수 없습니다.').optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, '올바른 색상 코드를 입력하세요.')
    .optional(),
  gradient: z.string().max(100).optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

/**
 * Zod 스키마 - 제품 생성/수정
 */
export const productSchema = z.object({
  title: z
    .string()
    .min(1, '제품명은 필수입니다.')
    .max(200, '제품명은 200자를 초과할 수 없습니다.'),
  slug: z
    .string()
    .min(1, 'Slug는 필수입니다.')
    .max(200, 'Slug는 200자를 초과할 수 없습니다.')
    .regex(/^[a-z0-9-]+$/, 'Slug는 소문자, 숫자, 하이픈만 사용할 수 있습니다.'),
  shortDescription: z
    .string()
    .max(500, '짧은 설명은 500자를 초과할 수 없습니다.')
    .optional(),
  fullDescription: z.string().optional(),
  price: z.number().int().min(0, '가격은 0 이상이어야 합니다.'),
  discountPrice: z
    .number()
    .int()
    .min(0, '할인가는 0 이상이어야 합니다.')
    .optional()
    .nullable(),
  features: z.array(z.string()).optional(),
  imageUrl: z.string().url('올바른 URL을 입력하세요.').optional().nullable(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  categoryIds: z.array(z.string()).optional(),
});

/**
 * Zod 스키마 - 관리자 로그인
 */
export const adminLoginSchema = z.object({
  username: z
    .string()
    .min(1, '사용자명은 필수입니다.')
    .max(50, '사용자명은 50자를 초과할 수 없습니다.')
    .regex(/^[a-zA-Z0-9_-]+$/, '사용자명은 영문, 숫자, -, _만 사용할 수 있습니다.'),
  password: z
    .string()
    .min(1, '비밀번호는 필수입니다.')
    .max(100, '비밀번호는 100자를 초과할 수 없습니다.'),
});

/**
 * Zod 스키마 - 사주 분석 요청
 */
export const sajuAnalysisSchema = z.object({
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '올바른 날짜 형식 (YYYY-MM-DD)을 입력하세요.'),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/, '올바른 시간 형식 (HH:MM)을 입력하세요.').optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  categoryId: z.string().uuid('올바른 카테고리 ID를 입력하세요.'),
});

/**
 * 입력값 새니타이제이션 (문자열)
 */
export function sanitizeInput(input: string): string {
  return input
    .trim() // 앞뒤 공백 제거
    .replace(/\s+/g, ' ') // 연속 공백 하나로
    .slice(0, 10000); // 최대 길이 제한 (DoS 방지)
}

/**
 * 객체의 모든 문자열 필드 새니타이제이션
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj };

  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeInput(sanitized[key]) as any;
    } else if (
      sanitized[key] &&
      typeof sanitized[key] === 'object' &&
      !Array.isArray(sanitized[key])
    ) {
      sanitized[key] = sanitizeObject(sanitized[key]);
    } else if (Array.isArray(sanitized[key])) {
      sanitized[key] = sanitized[key].map((item: any) =>
        typeof item === 'string' ? sanitizeInput(item) : item
      ) as any;
    }
  }

  return sanitized;
}

/**
 * 안전한 JSON 파싱
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * 페이지네이션 파라미터 검증
 */
export function validatePagination(
  page?: string | null,
  limit?: string | null
): { page: number; limit: number } {
  const parsedPage = parseInt(page || '1', 10);
  const parsedLimit = parseInt(limit || '20', 10);

  return {
    page: isNaN(parsedPage) || parsedPage < 1 ? 1 : Math.min(parsedPage, 1000),
    limit: isNaN(parsedLimit) || parsedLimit < 1 ? 20 : Math.min(parsedLimit, 100),
  };
}

/**
 * 정렬 파라미터 검증
 */
export function validateSorting(
  sortBy?: string | null,
  sortOrder?: string | null,
  allowedFields: string[] = []
): { sortBy: string; sortOrder: 'asc' | 'desc' } {
  const validSortBy =
    sortBy && allowedFields.includes(sortBy) ? sortBy : allowedFields[0] || 'createdAt';
  const validSortOrder = sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : 'desc';

  return {
    sortBy: validSortBy,
    sortOrder: validSortOrder,
  };
}
