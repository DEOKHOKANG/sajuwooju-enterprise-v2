/**
 * Analysis Section Component
 * Phase 8.11: Display AI analysis for each category
 */

'use client';

import { useState } from 'react';

interface AnalysisSectionProps {
  category: string;
  analysis: any;
  isExpanded: boolean;
  onToggle: () => void;
}

const CATEGORY_NAMES: Record<string, string> = {
  wealth: '재물운',
  love: '애정운/궁합',
  health: '건강운',
  breakup_recovery: '이별/재회',
  marriage: '결혼운',
  new_relationship: '새로운 연인',
  career: '직업운/취업',
  education: '학업운',
  business: '사업운',
  investment: '투자운',
  relocation: '이사/거주지',
  feng_shui: '풍수지리/음양오행',
};

const CATEGORY_ICONS: Record<string, string> = {
  wealth: '💰',
  love: '❤️',
  health: '🏥',
  breakup_recovery: '💔',
  marriage: '💍',
  new_relationship: '💕',
  career: '💼',
  education: '📚',
  business: '🏢',
  investment: '📈',
  relocation: '🏠',
  feng_shui: '🧭',
};

const CATEGORY_COLORS: Record<string, string> = {
  wealth: 'from-yellow-500 to-orange-500',
  love: 'from-pink-500 to-red-500',
  health: 'from-green-500 to-teal-500',
  breakup_recovery: 'from-purple-500 to-indigo-500',
  marriage: 'from-rose-500 to-pink-500',
  new_relationship: 'from-red-500 to-pink-500',
  career: 'from-blue-500 to-indigo-500',
  education: 'from-indigo-500 to-purple-500',
  business: 'from-gray-600 to-gray-800',
  investment: 'from-green-600 to-emerald-600',
  relocation: 'from-cyan-500 to-blue-500',
  feng_shui: 'from-amber-600 to-orange-600',
};

export default function AnalysisSection({
  category,
  analysis,
  isExpanded,
  onToggle,
}: AnalysisSectionProps) {
  const categoryName = CATEGORY_NAMES[category] || category;
  const icon = CATEGORY_ICONS[category] || '🔮';
  const colorClass = CATEGORY_COLORS[category] || 'from-gray-500 to-gray-700';

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header - Clickable */}
      <button
        onClick={onToggle}
        className="w-full text-left p-6 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center text-2xl`}>
              {icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{categoryName}</h3>
              {analysis.summary && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                  {analysis.summary}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {analysis.score !== undefined && (
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {analysis.score}
                </div>
                <div className="text-xs text-gray-500">점</div>
              </div>
            )}
            <svg
              className={`w-6 h-6 text-gray-400 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-6 border-t border-gray-100 pt-6">
          {/* Overall Analysis */}
          {analysis.overall && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                종합 분석
              </h4>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {analysis.overall}
              </p>
            </div>
          )}

          {/* Strengths */}
          {analysis.strengths && analysis.strengths.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                강점
              </h4>
              <ul className="space-y-2">
                {analysis.strengths.map((strength: string, index: number) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-gray-600"
                  >
                    <span className="text-green-600 mt-1">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Weaknesses */}
          {analysis.weaknesses && analysis.weaknesses.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                주의할 점
              </h4>
              <ul className="space-y-2">
                {analysis.weaknesses.map((weakness: string, index: number) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-gray-600"
                  >
                    <span className="text-orange-600 mt-1">!</span>
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Advice */}
          {analysis.advice && analysis.advice.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                조언
              </h4>
              <ul className="space-y-2">
                {analysis.advice.map((item: string, index: number) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-gray-600"
                  >
                    <span className="text-purple-600 mt-1">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Lucky Elements */}
          {analysis.luckyElements && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                행운의 요소
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {analysis.luckyElements.colors &&
                  analysis.luckyElements.colors.length > 0 && (
                    <div>
                      <div className="text-xs text-gray-600 mb-2">색상</div>
                      <div className="flex flex-wrap gap-1">
                        {analysis.luckyElements.colors.map(
                          (color: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-white rounded text-xs text-gray-700"
                            >
                              {color}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
                {analysis.luckyElements.directions &&
                  analysis.luckyElements.directions.length > 0 && (
                    <div>
                      <div className="text-xs text-gray-600 mb-2">방향</div>
                      <div className="flex flex-wrap gap-1">
                        {analysis.luckyElements.directions.map(
                          (dir: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-white rounded text-xs text-gray-700"
                            >
                              {dir}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
                {analysis.luckyElements.numbers &&
                  analysis.luckyElements.numbers.length > 0 && (
                    <div>
                      <div className="text-xs text-gray-600 mb-2">숫자</div>
                      <div className="flex flex-wrap gap-1">
                        {analysis.luckyElements.numbers.map(
                          (num: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-white rounded text-xs text-gray-700"
                            >
                              {num}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
                {analysis.luckyElements.items &&
                  analysis.luckyElements.items.length > 0 && (
                    <div>
                      <div className="text-xs text-gray-600 mb-2">아이템</div>
                      <div className="flex flex-wrap gap-1">
                        {analysis.luckyElements.items.map(
                          (item: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-white rounded text-xs text-gray-700"
                            >
                              {item}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Timeline (for certain categories) */}
          {analysis.timeline && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                시기별 전망
              </h4>
              <div className="space-y-3">
                {analysis.timeline.short_term && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs font-semibold text-gray-600 mb-1">
                      단기 (3개월)
                    </div>
                    <p className="text-sm text-gray-700">
                      {analysis.timeline.short_term}
                    </p>
                  </div>
                )}
                {analysis.timeline.mid_term && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs font-semibold text-gray-600 mb-1">
                      중기 (6개월)
                    </div>
                    <p className="text-sm text-gray-700">
                      {analysis.timeline.mid_term}
                    </p>
                  </div>
                )}
                {analysis.timeline.long_term && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs font-semibold text-gray-600 mb-1">
                      장기 (1년)
                    </div>
                    <p className="text-sm text-gray-700">
                      {analysis.timeline.long_term}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
