import Link from 'next/link';
import { Metadata } from 'next';
import { Home, Sparkles, Star, ArrowRight, Compass, Heart, Wallet, Briefcase, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: '페이지를 찾을 수 없습니다 | 사주우주',
  description: '요청하신 페이지를 찾을 수 없습니다. 인기 운세를 확인해보세요.',
};

/**
 * 404 Not Found 페이지
 *
 * === 404 정책 정의 ===
 *
 * [404 표시되어야 하는 경우]
 * 1. 존재하지 않는 카테고리: /saju/invalid-category
 * 2. DB에 없는 콘텐츠: /saju/love-fortune/non-existent
 * 3. 삭제/만료된 분석결과: /saju/result/expired-id
 * 4. 잘못된 URL 직접 입력
 *
 * [404 대신 대안 제공]
 * 1. 결제 페이지 - 기본 정보로 폴백
 * 2. Products 링크 - 사주 콘텐츠로 리다이렉트
 * 3. 카테고리 페이지 - 기본 콘텐츠 표시
 *
 * [사용자 경험 개선]
 * - 인기 카테고리 바로가기
 * - 인기 콘텐츠 추천
 * - 명확한 홈 CTA
 */

// 인기 카테고리
const POPULAR_CATEGORIES = [
  {
    name: '연애운',
    slug: 'love-fortune',
    icon: Heart,
    gradient: 'from-pink-500 to-rose-600',
    description: '사랑의 흐름',
  },
  {
    name: '재물운',
    slug: 'wealth-fortune',
    icon: Wallet,
    gradient: 'from-amber-500 to-orange-600',
    description: '부의 방향',
  },
  {
    name: '직장운',
    slug: 'career-fortune',
    icon: Briefcase,
    gradient: 'from-blue-500 to-indigo-600',
    description: '성공의 길',
  },
  {
    name: '궁합',
    slug: 'compatibility',
    icon: Users,
    gradient: 'from-purple-500 to-pink-600',
    description: '인연의 깊이',
  },
];

// 인기 콘텐츠
const POPULAR_CONTENTS = [
  { title: '재회 가능성 분석', slug: 'reunion-possibility', category: 'love-fortune', emoji: '💕' },
  { title: '올해 재물운', slug: 'yearly-wealth-flow', category: 'wealth-fortune', emoji: '💰' },
  { title: '승진 가능성', slug: 'promotion-possibility', category: 'career-fortune', emoji: '📈' },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-pink-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full">

          {/* 404 아이콘 */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              {/* 외부 링 애니메이션 */}
              <div className="absolute inset-0 -m-6 border-2 border-purple-300/50 rounded-full animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-0 -m-10 border border-pink-300/30 rounded-full animate-[spin_30s_linear_infinite_reverse]" />

              {/* 중앙 원 */}
              <div className="w-28 h-28 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl shadow-purple-300">
                <Compass className="w-14 h-14 text-white" />
              </div>

              {/* 장식 요소 */}
              <Star className="absolute -top-2 -right-2 w-6 h-6 text-amber-400 fill-amber-400 animate-pulse" />
              <Sparkles className="absolute -bottom-1 -left-3 w-5 h-5 text-pink-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>

          {/* 404 텍스트 */}
          <div className="text-center mb-8">
            <h1 className="text-7xl sm:text-8xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent mb-4">
              404
            </h1>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
              페이지를 찾을 수 없어요
            </h2>
            <p className="text-gray-500 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
              요청하신 페이지가 없거나 이동되었어요.
              <br />
              아래에서 원하시는 운세를 찾아보세요!
            </p>
          </div>

          {/* 빠른 액션 */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-purple-300 hover:shadow-xl hover:scale-105"
            >
              <Home className="w-5 h-5" />
              홈으로 가기
            </Link>
            <Link
              href="/saju/love-fortune"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-8 py-4 rounded-2xl border border-gray-200 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105"
            >
              <Sparkles className="w-5 h-5 text-purple-500" />
              운세 보기
            </Link>
          </div>

          {/* 인기 카테고리 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 p-6 mb-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              인기 카테고리
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {POPULAR_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.slug}
                    href={`/saju/${cat.slug}`}
                    className="group p-4 bg-gray-50 hover:bg-white rounded-2xl border border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-lg hover:scale-105 text-center"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${cat.gradient} rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="font-semibold text-gray-800 text-sm mb-0.5">{cat.name}</div>
                    <div className="text-gray-400 text-xs">{cat.description}</div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 인기 콘텐츠 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-400" />
              지금 인기 있는 운세
            </h3>
            <div className="space-y-2">
              {POPULAR_CONTENTS.map((content) => (
                <Link
                  key={content.slug}
                  href={`/saju/${content.category}/${content.slug}`}
                  className="flex items-center justify-between p-4 bg-gray-50 hover:bg-purple-50 rounded-xl transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{content.emoji}</span>
                    <span className="text-gray-700 font-medium group-hover:text-purple-700 transition-colors">
                      {content.title}
                    </span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          {/* 하단 안내 */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              문제가 계속되면{' '}
              <Link href="/" className="text-purple-500 hover:text-purple-600 underline underline-offset-2">
                홈페이지
              </Link>
              에서 다시 시작해보세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
