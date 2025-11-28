"use client";

import { Crown, TrendingUp, Users, Star, Zap } from "lucide-react";
import Link from "next/link";

interface BestsellerProduct {
  id: number;
  rank: number;
  title: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  soldCount: number;
  stockLeft: number;
  badge?: "HOT" | "NEW" | "BEST";
  gradient: string;
}

const BESTSELLER_PRODUCTS: BestsellerProduct[] = [
  {
    id: 1,
    rank: 1,
    title: "연애운 프리미엄 사주",
    subtitle: "당신의 연애운을 완벽 분석",
    price: 9900,
    originalPrice: 29000,
    discount: 66,
    rating: 4.9,
    reviews: 3247,
    soldCount: 12847,
    stockLeft: 23,
    badge: "BEST",
    gradient: "from-pink-400 to-rose-500",
  },
  {
    id: 2,
    rank: 2,
    title: "재물운 종합 분석",
    subtitle: "올해의 재물운을 한눈에",
    price: 12900,
    originalPrice: 35000,
    discount: 63,
    rating: 4.8,
    reviews: 2891,
    soldCount: 10234,
    stockLeft: 17,
    badge: "HOT",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    id: 3,
    rank: 3,
    title: "궁합 풀패키지",
    subtitle: "연인과의 궁합 완벽 분석",
    price: 15900,
    originalPrice: 45000,
    discount: 65,
    rating: 4.9,
    reviews: 4102,
    soldCount: 15678,
    stockLeft: 31,
    badge: "BEST",
    gradient: "from-violet-400 to-purple-500",
  },
];

/**
 * BestsellerUrgent Component
 * 긴박한 구매 유도 베스트셀러 섹션
 * - 랭킹 강조
 - 재고 부족 알림
 * - 판매량 표시
 * - 강력한 CTA
 */
export function BestsellerUrgent() {
  return (
    <section className="py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-full border border-yellow-300 mb-3 sm:mb-4 animate-pulse">
          <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 fill-yellow-600" />
          <span className="text-xs sm:text-sm font-bold text-yellow-800">실시간 베스트셀러</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 px-4">
          🔥 지금 가장 많이 팔리는 상품
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          <span className="font-bold text-red-600">오늘만 특가!</span> 빠르게 구매하세요
        </p>
      </div>

      {/* Products Grid */}
      <div className="space-y-4 sm:space-y-6">
        {BESTSELLER_PRODUCTS.map((product, index) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <div
              className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white border-2 border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300 cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient border on hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${product.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl`} />

              <div className="relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6">
                {/* Top section */}
                <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                  {/* Rank badge */}
                  <div className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${product.gradient} flex flex-col items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white text-[10px] sm:text-xs font-semibold">RANK</div>
                    <div className="text-white text-2xl sm:text-3xl font-bold">{product.rank}</div>
                  </div>

                  {/* Title and info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                      {product.badge && (
                        <span className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold rounded-full ${
                          product.badge === "BEST" ? "bg-yellow-400 text-yellow-900" :
                          product.badge === "HOT" ? "bg-red-500 text-white animate-pulse" :
                          "bg-green-500 text-white"
                        }`}>
                          {product.badge}
                        </span>
                      )}
                      <div className="flex items-center gap-0.5 sm:gap-1 text-yellow-500">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-500" />
                        <span className="font-bold text-gray-900 text-xs sm:text-sm">{product.rating}</span>
                        <span className="text-[10px] sm:text-xs text-gray-500">({product.reviews.toLocaleString()})</span>
                      </div>
                    </div>

                    <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-1 leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${product.gradient})` }}>
                      {product.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">
                      {product.subtitle}
                    </p>

                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-700">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                        <span className="font-semibold">{product.soldCount.toLocaleString()}명</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm">
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                        <span className="font-semibold text-red-600">재고 {product.stockLeft}개</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom section - Price and CTA */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-3 sm:pt-4 border-t-2 border-gray-100">
                  {/* Price */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-red-500 text-white font-bold text-sm sm:text-base rounded-full">
                        {product.discount}%
                      </span>
                      <span className="text-gray-400 line-through text-xs sm:text-sm">
                        {product.originalPrice.toLocaleString()}원
                      </span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {product.price.toLocaleString()}
                      <span className="text-base sm:text-lg text-gray-600">원</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button className={`flex-shrink-0 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r ${product.gradient} text-white font-bold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 flex items-center justify-center gap-1.5 sm:gap-2`}>
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">구매하기</span>
                  </button>
                </div>

                {/* Urgency bar */}
                {product.stockLeft < 30 && (
                  <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-red-50 border-2 border-red-200 rounded-lg sm:rounded-xl">
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-red-600 font-semibold text-xs sm:text-sm">
                      <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
                      <span>⚠️ 재고 부족! 서둘러 주문하세요</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom urgency message */}
      <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 border-2 border-red-200 rounded-xl sm:rounded-2xl text-center">
        <p className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">
          ⏰ 특가는 <span className="text-red-600">오늘만</span> 진행됩니다!
        </p>
        <p className="text-xs sm:text-sm text-gray-600">
          내일 가격이 인상될 수 있으니 지금 바로 구매하세요
        </p>
      </div>
    </section>
  );
}
