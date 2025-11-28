/**
 * Saju Result Display Component
 * Phase 8.11: Main result display with all sections
 */

'use client';

import { useState } from 'react';
import SajuBoard from './saju-board';
import AnalysisSection from './analysis-section';
import ShareButtons from './share-buttons';

interface SajuResultDisplayProps {
  sessionId: string;
  name: string;
  birthDate: Date;
  birthTime: number;
  gender: string;
  isLunar: boolean;
  sajuData: any;
  createdAt: Date;
}

export default function SajuResultDisplay({
  sessionId,
  name,
  birthDate,
  birthTime,
  gender,
  isLunar,
  sajuData,
  createdAt,
}: SajuResultDisplayProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { pillars, summary, analyses } = sajuData;

  // Format birth date
  const formattedBirthDate = new Date(birthDate).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const calendarType = isLunar ? '음력' : '양력';
  const genderText = gender === 'male' ? '남성' : '여성';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Section */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {name}님의 사주 분석 결과
        </h1>
        <div className="text-gray-600 space-y-1">
          <p className="text-lg">
            {formattedBirthDate} {calendarType} | {birthTime}시 출생 | {genderText}
          </p>
          <p className="text-sm text-gray-500">
            분석일: {new Date(createdAt).toLocaleDateString('ko-KR')}
          </p>
        </div>
      </header>

      {/* Saju Board - Four Pillars */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          사주팔자
        </h2>
        <SajuBoard pillars={pillars} />
      </section>

      {/* Summary Section */}
      {summary && (
        <section className="mb-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            사주 요약
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">
                사주팔자
              </h3>
              <p className="text-xl font-mono text-gray-900">
                {summary.pillarsText}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  강한 오행
                </h3>
                <p className="text-lg text-gray-900">
                  {summary.dominantElement}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  약한 오행
                </h3>
                <p className="text-lg text-gray-900">
                  {summary.weakElement}
                </p>
              </div>
            </div>
            {summary.elementDistribution && (
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-3">
                  오행 분포
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(summary.elementDistribution).map(([element, count]: [string, any]) => (
                    <div
                      key={element}
                      className="bg-gray-50 rounded-lg p-3 text-center"
                    >
                      <div className="text-xs text-gray-600 mb-1">{element}</div>
                      <div className="text-2xl font-bold text-gray-900">{count}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* AI Analysis Sections */}
      {analyses && Object.keys(analyses).length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            AI 분석 결과
          </h2>
          <div className="space-y-6">
            {Object.entries(analyses).map(([category, analysis]: [string, any]) => (
              <AnalysisSection
                key={category}
                category={category}
                analysis={analysis}
                isExpanded={selectedCategory === category}
                onToggle={() =>
                  setSelectedCategory(
                    selectedCategory === category ? null : category
                  )
                }
              />
            ))}
          </div>
        </section>
      )}

      {/* No Analysis Yet */}
      {(!analyses || Object.keys(analyses).length === 0) && (
        <section className="mb-12 bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            AI 분석이 아직 완료되지 않았습니다
          </h2>
          <p className="text-gray-600 mb-6">
            사주팔자 계산이 완료되었습니다. 추가 분석을 원하시면 아래 버튼을 눌러주세요.
          </p>
          <button
            className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors"
            onClick={() => {
              // Navigate to analysis selection page
              window.location.href = `/analyze/${sessionId}`;
            }}
          >
            AI 분석 시작하기
          </button>
        </section>
      )}

      {/* Share Section */}
      <section className="mb-12">
        <ShareButtons sessionId={sessionId} name={name} />
      </section>

      {/* Footer CTA */}
      <section className="text-center py-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          더 자세한 분석이 필요하신가요?
        </h2>
        <p className="text-gray-600 mb-6">
          전문가의 1:1 상담으로 더 깊이 있는 해석을 받아보세요
        </p>
        <button
          className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors"
          onClick={() => {
            window.location.href = '/';
          }}
        >
          전문 상담 신청하기
        </button>
      </section>
    </div>
  );
}
