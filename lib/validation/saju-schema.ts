/**
 * 사주 입력 폼 Zod 검증 스키마
 */

import { z } from "zod";

// Step 1: Category Selection
export const categorySchema = z.object({
  category: z.enum([
    "love",
    "wealth",
    "career",
    "compatibility",
    "yearly",
    "comprehensive",
  ]),
});

// Step 2: Basic Info
export const basicInfoSchema = z.object({
  name: z
    .string()
    .min(2, "이름은 최소 2글자 이상이어야 합니다.")
    .max(10, "이름은 최대 10글자까지 입력 가능합니다."),
  gender: z.enum(["male", "female"]),
});

// Step 3: Birth Date
export const birthDateSchema = z.object({
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "올바른 날짜 형식이 아닙니다. (YYYY-MM-DD)")
    .refine((date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      return year >= 1900 && year <= 2100;
    }, "1900년부터 2100년 사이의 날짜를 입력해주세요."),
  isLunar: z.boolean(),
});

// Step 4: Birth Time
export const birthTimeSchema = z.object({
  birthTime: z
    .string()
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "올바른 시간 형식이 아닙니다. (HH:MM)")
    .refine((time) => {
      const [hour, minute] = time.split(":").map(Number);
      return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
    }, "올바른 시간 범위를 입력해주세요. (00:00 ~ 23:59)"),
});

// Full Form Schema
export const sajuFormSchema = categorySchema
  .merge(basicInfoSchema)
  .merge(birthDateSchema)
  .merge(birthTimeSchema);

// Compatibility Form (두 사람)
export const compatibilityFormSchema = z.object({
  category: z.literal("compatibility"),
  person1: basicInfoSchema
    .merge(birthDateSchema)
    .merge(birthTimeSchema),
  person2: basicInfoSchema
    .merge(birthDateSchema)
    .merge(birthTimeSchema),
});

export type SajuFormSchema = z.infer<typeof sajuFormSchema>;
export type CompatibilityFormSchema = z.infer<typeof compatibilityFormSchema>;
