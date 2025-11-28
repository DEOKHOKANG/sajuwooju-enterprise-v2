/**
 * Zod Validation Schemas for Saju Input
 * Phase 8: Form Validation
 */

import { z } from 'zod';

// Saju Input Validation Schema
export const sajuInputSchema = z.object({
  name: z
    .string()
    .min(2, '이름은 최소 2자 이상이어야 합니다')
    .max(10, '이름은 최대 10자까지 입력 가능합니다')
    .regex(/^[가-힣a-zA-Z\s]+$/, '이름은 한글 또는 영문만 입력 가능합니다'),

  birthDate: z
    .date()
    .min(new Date('1900-01-01'), '1900년 이후 날짜를 선택해주세요')
    .max(new Date(), '미래 날짜는 선택할 수 없습니다'),

  birthTime: z
    .number()
    .min(0, '시간은 0시부터 23시까지 입력 가능합니다')
    .max(23, '시간은 0시부터 23시까지 입력 가능합니다')
    .int('정수 시간만 입력 가능합니다'),

  gender: z.enum(['male', 'female']),

  isLunar: z.boolean().default(false),
});

export type SajuInputFormData = z.infer<typeof sajuInputSchema>;

// Consultation Creation Schema (for API)
export const createConsultationSchema = z.object({
  userId: z.string().uuid().optional(),
  sessionId: z.string().uuid(),
  productId: z.string().optional(),
  name: sajuInputSchema.shape.name,
  birthDate: sajuInputSchema.shape.birthDate,
  birthTime: sajuInputSchema.shape.birthTime,
  gender: sajuInputSchema.shape.gender,
  isLunar: sajuInputSchema.shape.isLunar,
});

export type CreateConsultationData = z.infer<typeof createConsultationSchema>;

// Consultation Update Schema
export const updateConsultationSchema = z.object({
  sajuData: z.string().optional(),
  status: z.enum(['pending', 'completed', 'failed']).optional(),
});

export type UpdateConsultationData = z.infer<typeof updateConsultationSchema>;

// Consultation Query Parameters Schema
export const consultationQuerySchema = z.object({
  userId: z.string().uuid().optional(),
  sessionId: z.string().uuid().optional(),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(10),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  status: z.enum(['pending', 'completed', 'failed']).optional(),
});

export type ConsultationQueryData = z.infer<typeof consultationQuerySchema>;

// User Creation Schema (for Phase 11)
export const createUserSchema = z.object({
  kakaoId: z.string().optional(),
  name: z.string().min(2).max(50),
  email: z.string().email().optional(),
  profileImage: z.string().url().optional(),
});

export type CreateUserData = z.infer<typeof createUserSchema>;
