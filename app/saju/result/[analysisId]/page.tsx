'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Calendar,
  User,
  Download,
  Share2,
  Home,
  Loader2,
  Heart,
  Briefcase,
  DollarSign,
  Activity,
  TrendingUp,
  Star,
} from 'lucide-react';
import Link from 'next/link';

interface AnalysisPageProps {
  params: Promise<{
    analysisId: string;
  }>;
}

interface AnalysisData {
  id: string;
  title: string;
  birthDate: string;
  birthTime: string | null;
  isLunar: boolean;
  gender: string;
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  hourPillar: string | null;
  result: {
    analysis: string;
    name: string;
    birthInfo: any;
    sajuPillars: any;
    generatedAt: string;
  };
  createdAt: string;
}

export default function SajuResultPage({ params }: AnalysisPageProps) {
  const router = useRouter();
  const [analysisId, setAnalysisId] = useState<string>('');
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    params.then(p => {
      setAnalysisId(p.analysisId);
      fetchAnalysis(p.analysisId);
    });
  }, [params]);

  const fetchAnalysis = async (id: string) => {
    try {
      const response = await fetch(`/api/saju/analyses/${id}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || '분석 결과를 불러올 수 없습니다.');
      }

      setAnalysisData(data.data);
      setIsLoading(false);
    } catch (err: any) {
      console.error('Fetch analysis error:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!resultRef.current) return;

    try {
      // html2canvas를 동적으로 import
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#f8fafc',
        scale: 2,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `사주분석_${analysisData?.result.name}_${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download error:', err);
      alert('이미지 다운로드에 실패했습니다.');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: analysisData?.title || '사주 분석 결과',
      text: `${analysisData?.result.name}님의 사주 분석 결과를 확인해보세요!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Share error:', err);
      }
    } else {
      // Fallback: 클립보드에 복사
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('링크가 클립보드에 복사되었습니다!');
      } catch (err) {
        alert('공유 기능을 사용할 수 없습니다.');
      }
    }
  };

  // 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600 font-medium">분석 결과를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 발생
  if (error || !analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">오류 발생</h1>
          <p className="text-gray-600 mb-6">{error || '분석 결과를 찾을 수 없습니다.'}</p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition"
          >
            <Home className="w-5 h-5" />
            홈으로
          </Link>
        </div>
      </div>
    );
  }

  const parsedResult = parseMarkdown(analysisData.result.analysis);
  const birthDateObj = new Date(analysisData.birthDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Fixed Action Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-md z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            사주 분석 결과
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              <Share2 className="w-4 h-4" />
              공유
            </button>
            <button
              onClick={handleDownloadImage}
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              저장
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-12 px-4">
        <div ref={resultRef} className="max-w-4xl mx-auto">
          {/* Header Card */}
          <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-3xl shadow-2xl p-8 mb-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{analysisData.title}</h1>
                <p className="text-purple-100">
                  {birthDateObj.getFullYear()}년 {birthDateObj.getMonth() + 1}월{' '}
                  {birthDateObj.getDate()}일생
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <Star className="w-8 h-8" />
              </div>
            </div>

            {/* Saju Pillars */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mt-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                사주팔자
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <p className="text-sm text-purple-200 mb-1">년주</p>
                  <p className="text-2xl font-bold">{analysisData.yearPillar}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <p className="text-sm text-purple-200 mb-1">월주</p>
                  <p className="text-2xl font-bold">{analysisData.monthPillar}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <p className="text-sm text-purple-200 mb-1">일주</p>
                  <p className="text-2xl font-bold">{analysisData.dayPillar}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <p className="text-sm text-purple-200 mb-1">시주</p>
                  <p className="text-2xl font-bold">{analysisData.hourPillar || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Content */}
          <div className="space-y-6">
            {parsedResult.map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                    {getSectionIcon(section.title)}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h2>
                    <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                      {section.content.split('\n').map((line, i) => (
                        <p key={i} className="mb-2">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Info */}
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  분석일: {new Date(analysisData.result.generatedAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{analysisData.result.name}님</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
              본 분석은 전통 사주명리학을 기반으로 AI가 생성한 결과입니다.
              <br />
              참고용으로 활용하시고, 중요한 결정은 전문가와 상담하시기 바랍니다.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition font-semibold"
            >
              <Home className="w-5 h-5" />
              홈으로
            </Link>
            <button
              onClick={handleDownloadImage}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition shadow-lg hover:shadow-xl font-semibold"
            >
              <Download className="w-5 h-5" />
              이미지로 저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 마크다운 파싱 (간단한 버전)
 */
function parseMarkdown(markdown: string): Array<{ title: string; content: string }> {
  const sections: Array<{ title: string; content: string }> = [];
  const lines = markdown.split('\n');
  let currentSection: { title: string; content: string } | null = null;

  for (const line of lines) {
    // ## 헤더 감지
    if (line.startsWith('## ')) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: line.replace('## ', '').trim(),
        content: '',
      };
    }
    // # 헤더 무시 (메인 타이틀)
    else if (line.startsWith('# ')) {
      continue;
    }
    // --- 구분선 무시
    else if (line.startsWith('---')) {
      continue;
    }
    // 내용 추가
    else if (currentSection && line.trim()) {
      currentSection.content += line.trim() + '\n';
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
}

/**
 * 섹션별 아이콘 반환
 */
function getSectionIcon(title: string): React.ReactNode {
  const iconClass = 'w-6 h-6 text-purple-600';

  if (title.includes('성격') || title.includes('성향')) {
    return <User className={iconClass} />;
  } else if (title.includes('연애') || title.includes('인연')) {
    return <Heart className={iconClass} />;
  } else if (title.includes('직업') || title.includes('재물')) {
    return <Briefcase className={iconClass} />;
  } else if (title.includes('건강')) {
    return <Activity className={iconClass} />;
  } else if (title.includes('운세') || title.includes('올해')) {
    return <TrendingUp className={iconClass} />;
  } else if (title.includes('조언')) {
    return <Star className={iconClass} />;
  } else {
    return <Sparkles className={iconClass} />;
  }
}
