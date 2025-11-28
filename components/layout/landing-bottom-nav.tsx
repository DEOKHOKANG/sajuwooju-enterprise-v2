'use client';

import { Home, Compass, Star, History, User } from 'lucide-react';

/**
 * Landing Bottom Navigation
 * 글래스모피즘 기반 하단 네비게이션 (5개 메뉴)
 */

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    label: '홈',
    icon: <Home className="w-6 h-6" />,
    href: '#',
  },
  {
    id: 'explore',
    label: '탐색',
    icon: <Compass className="w-6 h-6" />,
    href: '#',
  },
  {
    id: 'fortune',
    label: '운세',
    icon: <Star className="w-6 h-6" />,
    href: '#',
  },
  {
    id: 'history',
    label: '내역',
    icon: <History className="w-6 h-6" />,
    href: '#',
  },
  {
    id: 'profile',
    label: '내정보',
    icon: <User className="w-6 h-6" />,
    href: '#',
  },
];

export function LandingBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="glass-nav backdrop-blur-xl bg-white/10 border-t border-white/20">
        <div className="max-w-7xl mx-auto px-2">
          <div className="flex items-center justify-around h-16">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="flex flex-col items-center justify-center flex-1 gap-1 py-2 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <div className="text-white/70 group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <span className="text-xs text-white/70 group-hover:text-white transition-colors">
                  {item.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
