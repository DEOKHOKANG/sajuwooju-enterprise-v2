"use client";

import { useState, useEffect } from "react";
import { Users, Eye, Heart, Lock, MessageCircle, Share2 } from "lucide-react";
import Link from "next/link";

// API에서 가져온 친구 사주 분석 타입
interface FriendSajuAnalysis {
  id: string;
  category: string;
  title: string | null;
  birthDate: string;
  birthTime: string | null;
  isLunar: boolean;
  visibility: string;
  viewCount: number;
  likeCount: number;
  shareCount: number;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

// Category icon mapping
const getCategoryIcon = (category: string): string => {
  const iconMap: { [key: string]: string } = {
    '연애운': '💕',
    '재물운': '💰',
    '직업운': '💼',
    '궁합': '💑',
    '연운': '🎯',
    '종합분석': '🌟'
  };
  return iconMap[category] || '✨';
};

export function FriendsSaju() {
  const [sharedAnalyses, setSharedAnalyses] = useState<FriendSajuAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // API에서 친구들의 사주 분석 가져오기
  useEffect(() => {
    const fetchFriendsSaju = async () => {
      try {
        const response = await fetch('/api/saju/friends');
        const data = await response.json();

        if (data.success) {
          setSharedAnalyses(data.analyses);
        } else {
          console.error('Failed to fetch friends saju:', data.error);
        }
      } catch (error) {
        console.error('Error fetching friends saju:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriendsSaju();
  }, []);

  const handleLike = async (id: string) => {
    // TODO: 좋아요 API 구현 (Phase 3.5)
    alert('좋아요 기능은 곧 추가됩니다!');
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-violet-600" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
            친구들의 사주
          </h2>
        </div>
        <div className="glass-card p-8 text-center">
          <div className="inline-block w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-slate-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Users className="w-6 h-6 text-violet-600" />
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
          친구들의 사주 ({sharedAnalyses.length})
        </h2>
      </div>

      {/* Info Box */}
      <div className="glass-card p-4 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200">
        <p className="text-sm text-slate-700">
          💡 친구가 <span className="font-semibold text-violet-600">공개</span>로 설정한 사주만 볼 수 있습니다
        </p>
      </div>

      {/* Viewable Analyses */}
      {sharedAnalyses.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-slate-600">공개된 친구의 사주가 없습니다</p>
          <p className="text-sm text-slate-500 mt-2">
            친구에게 사주 분석을 공유해달라고 요청해보세요!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sharedAnalyses.map((analysis) => (
            <div
              key={analysis.id}
              className="glass-card p-4 sm:p-6 space-y-4 hover:shadow-lg transition-all"
            >
              {/* User Info */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-400 flex items-center justify-center text-white font-bold">
                    {(analysis.user.name || 'U').charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{analysis.user.name || '익명'}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(analysis.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-xs px-3 py-1 rounded-full bg-violet-100 text-violet-600 font-medium">
                  {analysis.visibility === 'friends' ? '친구 공개' : '전체 공개'}
                </div>
              </div>

              {/* Content */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center text-2xl">
                  {getCategoryIcon(analysis.category)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800">{analysis.title || `${analysis.category} 분석`}</h3>
                  <p className="text-sm text-slate-500">{analysis.category}</p>
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{analysis.viewCount}</span>
                  </div>
                  <button
                    onClick={() => handleLike(analysis.id)}
                    className="flex items-center gap-1 transition-colors hover:text-red-500"
                  >
                    <Heart className="w-4 h-4" />
                    <span>{analysis.likeCount}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-violet-600 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">댓글</span>
                  </button>
                </div>

                <Link
                  href={`/share/saju/${analysis.id}`}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm font-medium hover:from-violet-600 hover:to-purple-600 transition-all"
                >
                  자세히 보기
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
