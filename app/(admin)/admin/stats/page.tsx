'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  DollarSign,
  Users,
  FileText,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  BarChart3,
  PieChart,
} from 'lucide-react';

interface StatsData {
  overview: {
    totalViews: number;
    viewsChange: number;
    totalRevenue: number;
    revenueChange: number;
    totalUsers: number;
    usersChange: number;
    totalAnalyses: number;
    analysesChange: number;
  };
  popularContent: {
    title: string;
    category: string;
    views: number;
    revenue: number;
  }[];
  revenueByCategory: {
    category: string;
    revenue: number;
    percentage: number;
  }[];
  dailyStats: {
    date: string;
    views: number;
    revenue: number;
  }[];
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // API 호출 시도
      const response = await fetch(`/api/admin/stats/overview?period=${period}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        // 더미 데이터
        setStats({
          overview: {
            totalViews: 45678,
            viewsChange: 12.5,
            totalRevenue: 12500000,
            revenueChange: 8.3,
            totalUsers: 1234,
            usersChange: 15.2,
            totalAnalyses: 3456,
            analysesChange: -2.1,
          },
          popularContent: [
            { title: '2025년 신년 운세', category: '연간운세', views: 5420, revenue: 2500000 },
            { title: '재회 가능성 분석', category: '연애운', views: 3210, revenue: 1800000 },
            { title: '커플 궁합 분석', category: '궁합', views: 2890, revenue: 1500000 },
            { title: '직장운 종합 분석', category: '직장운', views: 2340, revenue: 1200000 },
            { title: '재물운 2025', category: '재물운', views: 1980, revenue: 980000 },
          ],
          revenueByCategory: [
            { category: '연애운', revenue: 4500000, percentage: 36 },
            { category: '재물운', revenue: 3200000, percentage: 25.6 },
            { category: '직장운', revenue: 2100000, percentage: 16.8 },
            { category: '궁합', revenue: 1800000, percentage: 14.4 },
            { category: '건강운', revenue: 900000, percentage: 7.2 },
          ],
          dailyStats: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            views: Math.floor(Math.random() * 2000) + 1000,
            revenue: Math.floor(Math.random() * 500000) + 200000,
          })).reverse(),
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
    setLoading(false);
  };

  const formatNumber = (num: number) => num.toLocaleString('ko-KR');
  const formatCurrency = (num: number) =>
    new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(num);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  const overviewCards = [
    {
      title: '총 조회수',
      value: formatNumber(stats.overview.totalViews),
      change: stats.overview.viewsChange,
      icon: Eye,
      color: 'bg-blue-500',
    },
    {
      title: '총 매출',
      value: formatCurrency(stats.overview.totalRevenue),
      change: stats.overview.revenueChange,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: '총 사용자',
      value: formatNumber(stats.overview.totalUsers),
      change: stats.overview.usersChange,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: '총 분석 횟수',
      value: formatNumber(stats.overview.totalAnalyses),
      change: stats.overview.analysesChange,
      icon: FileText,
      color: 'bg-amber-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-purple-500" />
            통계 대시보드
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            사이트 성과 및 통계를 확인합니다.
          </p>
        </div>

        {/* 기간 선택 */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1">
          {(['7d', '30d', '90d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                period === p
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {p === '7d' ? '7일' : p === '30d' ? '30일' : '90일'}
            </button>
          ))}
        </div>
      </div>

      {/* 개요 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${card.color} text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    card.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {card.change >= 0 ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {Math.abs(card.change)}%
                </div>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{card.title}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 인기 콘텐츠 */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              인기 콘텐츠
            </h2>
          </div>
          <div className="space-y-4">
            {stats.popularContent.map((content, index) => (
              <div
                key={content.title}
                className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0"
              >
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 dark:text-white truncate">{content.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{content.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900 dark:text-white">
                    {formatNumber(content.views)} 조회
                  </p>
                  <p className="text-sm text-green-600">{formatCurrency(content.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 카테고리별 매출 */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-500" />
              카테고리별 매출
            </h2>
          </div>
          <div className="space-y-4">
            {stats.revenueByCategory.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {item.category}
                  </span>
                  <span className="text-sm text-slate-500">{formatCurrency(item.revenue)}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 일별 통계 */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            일별 추이
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">날짜</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">조회수</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">매출</th>
              </tr>
            </thead>
            <tbody>
              {stats.dailyStats.map((day) => (
                <tr
                  key={day.date}
                  className="border-b border-slate-100 dark:border-slate-800 last:border-0"
                >
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{day.date}</td>
                  <td className="px-4 py-3 text-sm text-right text-slate-900 dark:text-white font-medium">
                    {formatNumber(day.views)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-green-600 font-medium">
                    {formatCurrency(day.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
