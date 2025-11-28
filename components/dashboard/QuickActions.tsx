"use client";

import Link from "next/link";
import { Sparkles, MessageCircle, BookMarked } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      id: "new-analysis",
      icon: Sparkles,
      label: "새 사주 분석",
      href: "/main",
      gradient: "from-violet-500 to-purple-600",
      hoverGradient: "from-violet-600 to-purple-700",
    },
    {
      id: "ai-chat",
      icon: MessageCircle,
      label: "AI 채팅 시작",
      href: "/chat",
      gradient: "from-blue-500 to-cyan-600",
      hoverGradient: "from-blue-600 to-cyan-700",
    },
    {
      id: "saved",
      icon: BookMarked,
      label: "저장된 분석",
      href: "/my/consultations",
      gradient: "from-pink-500 to-rose-600",
      hoverGradient: "from-pink-600 to-rose-700",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <Link key={action.id} href={action.href}>
            <div className="group relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden">
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-500`} />

              {/* Glow effect */}
              <div className={`absolute -inset-1 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-75 blur-xl transition-opacity duration-500 -z-10`} />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>

                <span className="text-xs sm:text-sm font-bold text-white">
                  {action.label}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
