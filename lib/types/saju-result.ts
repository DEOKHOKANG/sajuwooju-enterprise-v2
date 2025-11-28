/**
 * 사주 분석 결과 타입 정의
 */

import { FortuneCategory } from "@/lib/prompts";
import { SajuFormData } from "./saju-form";

export interface SajuResultData extends SajuFormData {
  result: string; // OpenAI 분석 결과 (Markdown 형식)
  timestamp: number; // Unix timestamp
  analyzedAt: string; // ISO 8601 datetime
  sessionId: string; // UUID
}

export interface ResultSection {
  title: string;
  content: string;
  icon: string;
}

// 카테고리별 아이콘 및 색상
export const CATEGORY_CONFIG: Record<
  FortuneCategory,
  {
    title: string;
    icon: string;
    gradient: string;
    description: string;
  }
> = {
  love: {
    title: "연애운",
    icon: "💕",
    gradient: "from-pink-500 to-rose-500",
    description: "사랑과 인연의 흐름",
  },
  wealth: {
    title: "재물운",
    icon: "💰",
    gradient: "from-yellow-500 to-amber-500",
    description: "재물과 금전의 기운",
  },
  career: {
    title: "직업운",
    icon: "💼",
    gradient: "from-blue-500 to-indigo-500",
    description: "직업과 성공의 길",
  },
  compatibility: {
    title: "궁합",
    icon: "💑",
    gradient: "from-purple-500 to-pink-500",
    description: "두 사람의 인연",
  },
  yearly: {
    title: "신년운세",
    icon: "🎊",
    gradient: "from-green-500 to-teal-500",
    description: "새해의 운세",
  },
  comprehensive: {
    title: "종합운세",
    icon: "✨",
    gradient: "from-purple-500 to-indigo-500",
    description: "전반적인 운세",
  },
};
