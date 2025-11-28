'use client';

import Link from 'next/link';
import { Home, ArrowLeft, FolderTree, FileText, FileCode, Users, Settings } from 'lucide-react';

/**
 * 어드민 전용 404 페이지
 * Admin-specific 404 Not Found Page
 */
export default function AdminNotFound() {
  const quickLinks = [
    { name: '대시보드', href: '/admin/dashboard', icon: Home, color: 'bg-purple-500' },
    { name: '사주 카테고리', href: '/admin/saju-categories', icon: FolderTree, color: 'bg-blue-500' },
    { name: '사주 템플릿', href: '/admin/saju-templates', icon: FileCode, color: 'bg-pink-500' },
    { name: '사주 콘텐츠', href: '/admin/saju-contents', icon: FileText, color: 'bg-emerald-500' },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 아이콘 */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl">
            <span className="text-4xl font-black">404</span>
          </div>
        </div>

        {/* 메시지 */}
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          요청하신 어드민 페이지가 존재하지 않거나 이동되었습니다.
          <br />
          아래 메뉴에서 원하는 페이지로 이동해주세요.
        </p>

        {/* 빠른 링크 */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md transition-all group"
              >
                <div className={`p-2 rounded-lg ${link.color} text-white`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {link.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* 메인 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            대시보드로 가기
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold px-6 py-3 rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            뒤로 가기
          </button>
        </div>

        {/* 도움말 */}
        <p className="mt-8 text-sm text-slate-400">
          문제가 계속되면 시스템 관리자에게 문의하세요.
        </p>
      </div>
    </div>
  );
}
