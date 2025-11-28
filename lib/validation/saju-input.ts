/**
 * Saju Input Validation Schema (Zod)
 * 사주 입력 폼 검증 스키마
 */

import { z } from 'zod';
import { SAJU_CATEGORIES } from '@/lib/saju-input-data';

// 카테고리 ID 추출
const categoryIds = SAJU_CATEGORIES.map(cat => cat.id) as [string, ...string[]];

// Step 1: 카테고리 선택
export const step1Schema = z.object({
  category: z.enum(categoryIds),
});

// Step 2: 기본 정보
export const step2Schema = z.object({
  name: z
    .string()
    .min(2, '이름은 최소 2자 이상이어야 합니다')
    .max(20, '이름은 최대 20자까지 입력 가능합니다')
    .regex(/^[가-힣a-zA-Z\s]+$/, '이름은 한글 또는 영문만 입력 가능합니다'),
  gender: z.enum(['male', 'female']),
});

// Step 3: 생년월일
export const step3Schema = z.object({
  calendarType: z.enum(['solar', 'lunar']),
  year: z
    .number()
    .min(1900, '1900년 이후 날짜만 입력 가능합니다')
    .max(new Date().getFullYear(), '미래 날짜는 입력할 수 없습니다'),
  month: z.number().min(1, '월은 1-12 사이의 값이어야 합니다').max(12),
  day: z.number().min(1, '일은 1-31 사이의 값이어야 합니다').max(31),
});

// Step 4: 출생시간
export const step4Schema = z.object({
  birthHour: z.string().min(1, '출생시간을 선택해주세요'),
});

// 전체 폼 스키마
export const sajuInputSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .refine(
    (data) => {
      // 날짜 유효성 검증
      const date = new Date(data.year, data.month - 1, data.day);
      return (
        date.getFullYear() === data.year &&
        date.getMonth() === data.month - 1 &&
        date.getDate() === data.day
      );
    },
    {
      message: '유효하지 않은 날짜입니다',
      path: ['day'],
    }
  );

export type SajuInputFormData = z.infer<typeof sajuInputSchema>;

// 궁합 전용 스키마 (상대방 정보 포함) - .merge 사용 (.refine 때문에 .extend 불가)
export const compatibilitySchema = sajuInputSchema.merge(
  z.object({
    partnerName: z
      .string()
      .min(2, '상대방 이름은 최소 2자 이상이어야 합니다')
      .max(20, '상대방 이름은 최대 20자까지 입력 가능합니다'),
    partnerGender: z.enum(['male', 'female']),
    partnerCalendarType: z.enum(['solar', 'lunar']),
    partnerYear: z.number().min(1900).max(new Date().getFullYear()),
    partnerMonth: z.number().min(1).max(12),
    partnerDay: z.number().min(1).max(31),
    partnerBirthHour: z.string().min(1),
  })
);

export type CompatibilityFormData = z.infer<typeof compatibilitySchema>;
