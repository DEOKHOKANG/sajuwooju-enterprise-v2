/**
 * OpenAI Client Service
 * Phase 8.9: AI Analysis Implementation
 */

import OpenAI from 'openai';
import { AIAnalysisRequest, AIAnalysisResponse, SajuCategory } from '@/lib/types/openai';
import { getPromptConfig, fillPromptTemplate } from './prompts';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
});

/**
 * Format saju data for prompt
 */
function formatSajuDataForPrompt(request: AIAnalysisRequest): Record<string, string> {
  const { sajuData, partnerData } = request;

  const formatPillar = (pillar: { heaven: string; earth: string }) =>
    `${pillar.heaven}${pillar.earth}`;

  const data: Record<string, string> = {
    name: sajuData.name,
    gender: sajuData.gender === 'male' ? '남성' : '여성',
    birthDate: sajuData.birthDate.toLocaleDateString('ko-KR'),
    isLunar: sajuData.isLunar ? '(음력)' : '(양력)',
    birthTime: `${sajuData.birthTime}`,
    yearPillar: formatPillar(sajuData.pillars.year),
    monthPillar: formatPillar(sajuData.pillars.month),
    dayPillar: formatPillar(sajuData.pillars.day),
    timePillar: formatPillar(sajuData.pillars.time),
  };

  // For love/compatibility category with partner
  if (partnerData) {
    data.hasPartner = '궁합 분석';
    data.partnerInfo = `
상대방 정보:
이름: ${partnerData.name}
성별: ${partnerData.gender === 'male' ? '남성' : '여성'}
생년월일: ${partnerData.birthDate.toLocaleDateString('ko-KR')} ${
      partnerData.isLunar ? '(음력)' : '(양력)'
    }
출생시간: ${partnerData.birthTime}시`;
    data.compatibilityAnalysis = '두 사람의 궁합 분석 (0-100점 점수 포함)';
  } else {
    data.hasPartner = '개인 애정운 분석';
    data.partnerInfo = '';
    data.compatibilityAnalysis = '이상형 분석';
  }

  return data;
}

/**
 * Call OpenAI API for saju analysis
 */
export async function analyzeSajuWithAI(
  request: AIAnalysisRequest
): Promise<AIAnalysisResponse> {
  const promptConfig = getPromptConfig(request.category);
  const promptData = formatSajuDataForPrompt(request);
  const userPrompt = fillPromptTemplate(promptConfig.userPromptTemplate, promptData);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview', // or 'gpt-4', 'gpt-3.5-turbo'
      messages: [
        {
          role: 'system',
          content: promptConfig.systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      max_tokens: promptConfig.maxTokens,
      temperature: promptConfig.temperature,
      response_format: { type: 'json_object' }, // Ensure JSON response
    });

    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error('No response from OpenAI');
    }

    // Parse JSON response
    const analysisData = JSON.parse(responseContent);

    // Construct response
    const response: AIAnalysisResponse = {
      category: request.category,
      analysis: {
        summary: analysisData.summary || '',
        overall: analysisData.overall || '',
        strengths: analysisData.strengths || [],
        weaknesses: analysisData.weaknesses || [],
        advice: analysisData.advice || [],
        luckyElements: analysisData.luckyElements || {
          colors: [],
          directions: [],
          numbers: [],
          items: [],
        },
        score: analysisData.score,
        timeline: analysisData.timeline,
      },
      metadata: {
        generatedAt: new Date(),
        model: completion.model,
        tokens: completion.usage?.total_tokens || 0,
      },
    };

    return response;
  } catch (error: any) {
    console.error('[OpenAI Analysis Error]', error);

    // Handle OpenAI API errors
    if (error.response) {
      throw new Error(`OpenAI API Error: ${error.response.data?.error?.message || 'Unknown error'}`);
    }

    throw new Error(`AI Analysis Failed: ${error.message}`);
  }
}

/**
 * Estimate cost for analysis (approximate)
 */
export function estimateAnalysisCost(category: SajuCategory): number {
  const promptConfig = getPromptConfig(category);
  const estimatedInputTokens = 1500; // Average
  const estimatedOutputTokens = promptConfig.maxTokens;

  // GPT-4 Turbo pricing (as of 2024)
  const inputCostPer1K = 0.01; // $0.01 per 1K tokens
  const outputCostPer1K = 0.03; // $0.03 per 1K tokens

  const inputCost = (estimatedInputTokens / 1000) * inputCostPer1K;
  const outputCost = (estimatedOutputTokens / 1000) * outputCostPer1K;

  return inputCost + outputCost; // in USD
}

/**
 * Validate AI response structure
 */
export function validateAIResponse(data: any): boolean {
  return !!(
    data.summary &&
    data.overall &&
    Array.isArray(data.strengths) &&
    Array.isArray(data.weaknesses) &&
    Array.isArray(data.advice) &&
    data.luckyElements &&
    Array.isArray(data.luckyElements.colors)
  );
}
