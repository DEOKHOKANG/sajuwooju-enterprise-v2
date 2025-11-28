'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RotateCcw, FileText, FolderTree } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * 어드민 전용 에러 페이지
 * Admin-specific Error Boundary
 */
export default function AdminError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 에러 로깅
    console.error('Admin Error:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* 에러 아이콘 */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-xl">
            <AlertTriangle className="w-12 h-12" />
          </div>
        </div>

        {/* 에러 메시지 */}
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
          오류가 발생했습니다
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          페이지를 불러오는 중 문제가 발생했습니다.
          <br />
          잠시 후 다시 시도해주세요.
        </p>

        {/* 개발 모드에서만 에러 상세 표시 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-left">
            <p className="text-sm font-semibold text-red-800 dark:text-red-400 mb-2">
              개발자 정보
            </p>
            <p className="text-xs font-mono text-red-600 dark:text-red-300 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-500 dark:text-red-400 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            <RotateCcw className="w-5 h-5" />
            다시 시도
          </button>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold px-6 py-3 rounded-xl transition-all"
          >
            <Home className="w-5 h-5" />
            대시보드로 가기
          </Link>
        </div>

        {/* 빠른 링크 */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            다른 페이지로 이동하시겠습니까?
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/admin/saju-categories"
              className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
            >
              <FolderTree className="w-4 h-4" />
              카테고리 관리
            </Link>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <Link
              href="/admin/saju-contents"
              className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
            >
              <FileText className="w-4 h-4" />
              콘텐츠 관리
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
