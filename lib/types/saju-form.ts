/**
 * 사주 입력 폼 타입 정의
 */

import { FortuneCategory } from "@/lib/prompts";

export interface SajuFormData {
  // Step 1: Category
  category: FortuneCategory;

  // Step 2: Basic Info
  name: string;
  gender: "male" | "female";

  // Step 3: Birth Date
  calendarType: "solar" | "lunar";
  year: number;
  month: number;
  day: number;

  // Step 4: Birth Time
  birthHour: string; // 12지지 time slot (e.g., "23-01" for 자시)
}

export interface CompatibilityFormData {
  // Step 1: Category (always 'compatibility')
  category: "compatibility";

  // Step 2: Person 1
  person1: {
    name: string;
    gender: "male" | "female";
    calendarType: "solar" | "lunar";
    year: number;
    month: number;
    day: number;
    birthHour: string;
  };

  // Step 3: Person 2
  person2: {
    name: string;
    gender: "male" | "female";
    calendarType: "solar" | "lunar";
    year: number;
    month: number;
    day: number;
    birthHour: string;
  };
}

export type FormStep = 1 | 2 | 3 | 4;

export interface StepConfig {
  step: FormStep;
  title: string;
  description: string;
}
