'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, Zap, Users, User } from 'lucide-react';

/**
 * Mobile Bottom Navigation (상용화급)
 * 모바일 하단 네비게이션 - HOME, MATCH, HYPE, FEED, MY
 */

export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/main',
      label: 'HOME',
      icon: Home,
    },
    {
      href: '/match',
      label: 'MATCH',
      icon: Heart,
    },
    {
      href: '/hype',
      label: 'HYPE',
      icon: Zap,
    },
    {
      href: '/feed',
      label: 'FEED',
      icon: Users,
    },
    {
      href: '/dashboard',
      label: 'MY',
      icon: User,
    },
  ];

  // Don't show on landing page
  if (pathname === '/') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-nav backdrop-blur-2xl bg-white/80 border-t border-white/20 shadow-lg safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-all duration-200 ${
                isActive
                  ? 'text-cosmic-purple scale-105'
                  : 'text-gray-500 hover:text-gray-700 hover:scale-105 active:scale-95'
              }`}
            >
              <div className={`relative ${isActive ? 'animate-pulse' : ''}`}>
                <Icon className="w-6 h-6" />
                {isActive && (
                  <div className="absolute inset-0 bg-cosmic-purple/20 rounded-full blur-md -z-10"></div>
                )}
              </div>
              <span className="text-xs font-medium drop-shadow-sm">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
