"use client";

/**
 * 어드민 대시보드 페이지
 * Admin Dashboard Page
 *
 * Features:
 * - 통계 요약 (사용자, 컨텐츠, 결제 등)
 * - 최근 활동
 * - 빠른 액션 버튼
 */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  FileText,
  FolderTree,
  FileCode,
  TrendingUp,
  Eye,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Loader2,
} from "lucide-react";

interface DashboardStats {
  users: { total: number; change: number };
  categories: { total: number; active: number };
  templates: { total: number; active: number };
  contents: { total: number; published: number };
  views: { total: number; change: number };
  revenue: { total: number; change: number };
}

interface RecentActivity {
  id: string;
  type: "user" | "content" | "template" | "payment";
  message: string;
  timestamp: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 실제 API 연동 전 더미 데이터
    const fetchData = async () => {
      setLoading(true);

      // TODO: 실제 API 호출로 교체
      await new Promise((resolve) => setTimeout(resolve, 500));

      setStats({
        users: { total: 1234, change: 12.5 },
        categories: { total: 8, active: 6 },
        templates: { total: 24, active: 18 },
        contents: { total: 156, published: 120 },
        views: { total: 45678, change: 8.3 },
        revenue: { total: 12500000, change: -2.1 },
      });

      setActivities([
        {
          id: "1",
          type: "user",
          message: "새 사용자 가입: user123@example.com",
          timestamp: "5분 전",
        },
        {
          id: "2",
          type: "content",
          message: '"2024년 운세 총운" 컨텐츠가 게시됨',
          timestamp: "15분 전",
        },
        {
          id: "3",
          type: "payment",
          message: "프리미엄 결제 완료: ₩29,000",
          timestamp: "1시간 전",
        },
        {
          id: "4",
          type: "template",
          message: '"궁합 분석" 템플릿이 업데이트됨',
          timestamp: "2시간 전",
        },
        {
          id: "5",
          type: "user",
          message: "새 사용자 가입: happy@example.com",
          timestamp: "3시간 전",
        },
      ]);

      setLoading(false);
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: "전체 사용자",
      value: stats?.users.total ?? 0,
      change: stats?.users.change ?? 0,
      icon: Users,
      color: "bg-blue-500",
      href: "/admin/users",
    },
    {
      title: "사주 카테고리",
      value: stats?.categories.total ?? 0,
      subtext: `${stats?.categories.active ?? 0}개 활성`,
      icon: FolderTree,
      color: "bg-purple-500",
      href: "/admin/saju-categories",
    },
    {
      title: "사주 템플릿",
      value: stats?.templates.total ?? 0,
      subtext: `${stats?.templates.active ?? 0}개 활성`,
      icon: FileCode,
      color: "bg-pink-500",
      href: "/admin/saju-templates",
    },
    {
      title: "사주 컨텐츠",
      value: stats?.contents.total ?? 0,
      subtext: `${stats?.contents.published ?? 0}개 게시됨`,
      icon: FileText,
      color: "bg-emerald-500",
      href: "/admin/saju-contents",
    },
    {
      title: "총 조회수",
      value: stats?.views.total ?? 0,
      change: stats?.views.change ?? 0,
      icon: Eye,
      color: "bg-amber-500",
      href: "/admin/stats",
    },
    {
      title: "총 매출",
      value: stats?.revenue.total ?? 0,
      change: stats?.revenue.change ?? 0,
      icon: DollarSign,
      color: "bg-green-500",
      href: "/admin/stats",
      isCurrency: true,
    },
  ];

  const quickActions = [
    {
      label: "새 카테고리",
      href: "/admin/saju-categories",
      icon: FolderTree,
      color: "text-purple-600 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30",
    },
    {
      label: "새 템플릿",
      href: "/admin/saju-templates",
      icon: FileCode,
      color: "text-pink-600 bg-pink-50 hover:bg-pink-100 dark:bg-pink-900/20 dark:hover:bg-pink-900/30",
    },
    {
      label: "새 컨텐츠",
      href: "/admin/saju-contents",
      icon: FileText,
      color: "text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30",
    },
    {
      label: "사용자 관리",
      href: "/admin/users",
      icon: Users,
      color: "text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30",
    },
  ];

  const activityIcons = {
    user: Users,
    content: FileText,
    template: FileCode,
    payment: DollarSign,
  };

  const activityColors = {
    user: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    content: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    template: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
    payment: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  };

  const formatNumber = (num: number, isCurrency = false) => {
    if (isCurrency) {
      return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
        maximumFractionDigits: 0,
      }).format(num);
    }
    return num.toLocaleString("ko-KR");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          대시보드
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          사주우주 어드민 대시보드에 오신 것을 환영합니다.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${card.color} text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 transition-colors" />
              </div>
              <div className="mt-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {card.title}
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  {formatNumber(card.value, card.isCurrency)}
                </p>
                {card.change !== undefined && (
                  <div
                    className={`mt-2 flex items-center gap-1 text-sm ${
                      card.change >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {card.change >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span>{Math.abs(card.change)}%</span>
                    <span className="text-slate-500">vs 지난달</span>
                  </div>
                )}
                {card.subtext && (
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {card.subtext}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            빠른 작업
          </h2>
          <div className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${action.color}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{action.label}</span>
                  <Plus className="w-4 h-4 ml-auto" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              최근 활동
            </h2>
            <Activity className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = activityIcons[activity.type];
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0"
                >
                  <div
                    className={`p-2 rounded-lg ${activityColors[activity.type]}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 dark:text-white">
                      {activity.message}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
