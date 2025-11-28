'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, Bell, User, Menu, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';
import { SajuLogo } from '@/components/icons/SajuLogo';

/**
 * Mobile Header
 * 모바일 상단 헤더 with hamburger menu
 */

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  showNotification?: boolean;
}

export function MobileHeader({
  title = '사주우주',
  showBack = false,
  showNotification = true,
}: MobileHeaderProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Don't show on landing page
  if (pathname === '/') {
    return null;
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-10 glass-header backdrop-blur-2xl bg-white/80 border-b border-white/20 shadow-sm safe-area-pt">
        <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
          {/* Left: Hamburger menu or Back button + SAJU Logo */}
          <div className="flex items-center gap-2">
            {showBack ? (
              <button
                onClick={() => window.history.back()}
                className="p-2 -ml-2 text-gray-700 hover:text-gray-900 transition-all duration-200 hover:scale-110 active:scale-95"
                aria-label="뒤로 가기"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            ) : (
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 -ml-2 text-gray-700 hover:text-gray-900 transition-all duration-200 hover:scale-110 active:scale-95"
                aria-label="메뉴 열기"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}

            {/* SAJU Logo - Home Link */}
            <Link
              href="/main"
              className="p-1 hover:scale-110 transition-all duration-200 active:scale-95"
              aria-label="홈으로 이동"
            >
              <SajuLogo className="w-7 h-7 text-cosmic-purple" />
            </Link>
          </div>

          {/* Center: Title */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <h1 className="text-base font-bold bg-gradient-to-r from-cosmic-purple to-nebula-pink bg-clip-text text-transparent drop-shadow-sm">
              {title}
            </h1>
          </div>

        {/* Right: Profile/Login button */}
        <div className="flex items-center justify-end gap-2">
          {showNotification && (
            <button
              className="p-2 text-gray-700 hover:text-gray-900 transition-all duration-200 hover:scale-110 active:scale-95 relative"
              aria-label="알림"
            >
              <Bell className="w-5 h-5" />
              {/* Notification badge */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></span>
            </button>
          )}

          {/* User Profile / Login */}
          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          ) : session ? (
            <Link href="/profile" className="flex items-center">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-cosmic-purple/30 hover:border-cosmic-purple transition-all duration-200 hover:scale-110">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cosmic-purple to-nebula-pink flex items-center justify-center text-white text-xs font-bold">
                    {session.user?.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
            </Link>
          ) : (
            <Link
              href="/auth/signin"
              className="p-2 text-gray-700 hover:text-cosmic-purple transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="로그인"
            >
              <User className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>
    </header>

      {/* Side Menu Drawer */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 shadow-2xl transform transition-transform duration-300">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cosmic-purple to-nebula-pink flex items-center justify-center text-white font-bold">
                  {session?.user?.name?.charAt(0) || "사"}
                </div>
                <div>
                  <div className="font-bold text-gray-900">
                    {session?.user?.name || "게스트"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {session?.user?.email || "로그인이 필요합니다"}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
                aria-label="메뉴 닫기"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Menu Items */}
            <nav className="p-4 space-y-2">
              <Link
                href="/main"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 transition-all duration-200"
              >
                <span className="text-2xl">🏠</span>
                <span className="font-medium text-gray-700">홈</span>
              </Link>
              <Link
                href="/saju/new"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 transition-all duration-200"
              >
                <span className="text-2xl">🔮</span>
                <span className="font-medium text-gray-700">사주 분석</span>
              </Link>
              <Link
                href="/chat"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 transition-all duration-200"
              >
                <span className="text-2xl">💬</span>
                <span className="font-medium text-gray-700">AI 채팅</span>
              </Link>
              <Link
                href="/saved"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 transition-all duration-200"
              >
                <span className="text-2xl">💾</span>
                <span className="font-medium text-gray-700">저장함</span>
              </Link>
              <Link
                href="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 transition-all duration-200"
              >
                <span className="text-2xl">👤</span>
                <span className="font-medium text-gray-700">마이페이지</span>
              </Link>

              <div className="pt-4 mt-4 border-t border-gray-200">
                <Link
                  href="/settings"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 transition-all duration-200"
                >
                  <span className="text-2xl">⚙️</span>
                  <span className="font-medium text-gray-700">설정</span>
                </Link>
                {session ? (
                  <Link
                    href="/auth/signout"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200"
                  >
                    <span className="text-2xl">🚪</span>
                    <span className="font-medium text-red-600">로그아웃</span>
                  </Link>
                ) : (
                  <Link
                    href="/auth/signin"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200"
                  >
                    <span className="text-2xl">🔑</span>
                    <span className="font-medium text-green-600">로그인</span>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
