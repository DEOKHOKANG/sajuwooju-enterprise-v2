'use client';

import { useState } from 'react';
import { Menu, Search, User } from 'lucide-react';

/**
 * Landing Header Component
 * 글래스모피즘 기반 상단 헤더 (햄버거 메뉴, 로고, 검색, 프로필)
 */

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 safe-top">
        <div className="glass-header backdrop-blur-xl bg-white/10 border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
              {/* Left: Hamburger Menu */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="glass-button p-2 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="메뉴"
              >
                <Menu className="w-6 h-6 text-white" />
              </button>

              {/* Center: Logo */}
              <div className="flex-1 flex justify-center">
                <h1 className="font-display text-2xl font-bold">
                  <span className="bg-gradient-to-r from-star-gold via-cosmic-purple to-nebula-pink bg-clip-text text-transparent">
                    사주우주
                  </span>
                </h1>
              </div>

              {/* Right: Search & Profile */}
              <div className="flex items-center gap-2">
                <button
                  className="glass-button p-2 rounded-lg hover:bg-white/20 transition-colors"
                  aria-label="검색"
                >
                  <Search className="w-6 h-6 text-white" />
                </button>
                <button
                  className="glass-button p-2 rounded-lg hover:bg-white/20 transition-colors"
                  aria-label="프로필"
                >
                  <User className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Menu */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute top-0 left-0 bottom-0 w-80 bg-space-black/95 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6">메뉴</h2>
            <nav className="space-y-4">
              <a href="#" className="block text-lg text-white/80 hover:text-white transition-colors">
                사주 보기
              </a>
              <a href="#" className="block text-lg text-white/80 hover:text-white transition-colors">
                운세
              </a>
              <a href="#" className="block text-lg text-white/80 hover:text-white transition-colors">
                궁합
              </a>
              <a href="#" className="block text-lg text-white/80 hover:text-white transition-colors">
                내 정보
              </a>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
