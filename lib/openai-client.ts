/**
 * OpenAI API Client
 * GPT-4 기반 사주 분석 서비스
 *
 * NOTE: Temporarily disabled - OPENAI_API_KEY not configured for deployment
 */

import OpenAI from "openai";

// API Key validation - disabled for deployment
const apiKey = process.env.OPENAI_API_KEY;

// Lazy initialization - only throw error when actually used
let _openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set in environment variables");
  }

  if (!_openai) {
    _openai = new OpenAI({
      apiKey: apiKey,
      organization: process.env.OPENAI_ORG_ID,
    });
  }

  return _openai;
}

// Deprecated - use getOpenAIClient() instead
export const openai = {
  get chat() {
    return getOpenAIClient().chat;
  }
} as OpenAI;

/**
 * GPT-4 모델로 사주 분석 요청
 */
export async function generateSajuAnalysis(
  prompt: string,
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<string> {
  try {
    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: options?.model || "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "당신은 30년 경력의 전문 사주 명리학자입니다. 음양오행과 천간지지에 대한 깊은 이해를 바탕으로 정확하고 세심한 사주 분석을 제공합니다.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 2000,
    });

    return response.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("사주 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }
}

/**
 * GPT-4 모델로 JSON 응답 생성
 */
export async function generateSajuJSON<T>(
  prompt: string,
  options?: {
    model?: string;
    temperature?: number;
  }
): Promise<T> {
  try {
    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: options?.model || "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "당신은 30년 경력의 전문 사주 명리학자입니다. 응답은 반드시 유효한 JSON 형식으로 제공해야 합니다.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: options?.temperature || 0.7,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content || "{}";
    return JSON.parse(content) as T;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("사주 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }
}

/**
 * AI 채팅 스트리밍 (실시간 대화)
 */
export async function* streamSajuChat(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>
): AsyncGenerator<string, void, unknown> {
  try {
    const client = getOpenAIClient();
    const stream = await client.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "당신은 친근하고 공감 능력이 뛰어난 사주 명리 상담사입니다. 사용자의 고민을 경청하고 따뜻한 조언을 제공합니다.",
        },
        ...messages,
      ],
      temperature: 0.8,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  } catch (error) {
    console.error("OpenAI Streaming Error:", error);
    throw new Error("채팅 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }
}

/**
 * Rate limiting 및 에러 처리를 위한 래퍼 함수
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Rate limit 에러인 경우 대기 시간 증가
      if (error instanceof Error && error.message.includes("rate_limit")) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * (i + 1)));
        continue;
      }

      // 다른 에러는 즉시 throw
      throw error;
    }
  }

  throw lastError || new Error("Unknown error");
}
