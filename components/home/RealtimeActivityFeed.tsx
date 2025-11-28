"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Heart, Zap, Users } from "lucide-react";

/**
 * Realtime Activity Feed
 * 실시간 활동 피드 (상용화급 소셜 프루프)
 */

interface Activity {
  id: string;
  icon: string;
  name: string;
  action: string;
  time: string;
  color: string;
}

const MOCK_ACTIVITIES: Activity[] = [
  { id: "1", icon: "🔥", name: "김**", action: "연애운 분석 완료", time: "1분 전", color: "from-red-400 to-pink-500" },
  { id: "2", icon: "💰", name: "이**", action: "재물운 상담 시작", time: "2분 전", color: "from-amber-400 to-yellow-500" },
  { id: "3", icon: "❤️", name: "박**", action: "궁합 매칭 성공", time: "3분 전", color: "from-pink-400 to-rose-500" },
  { id: "4", icon: "💼", name: "최**", action: "직업운 분석 완료", time: "4분 전", color: "from-blue-400 to-cyan-500" },
  { id: "5", icon: "✨", name: "정**", action: "종합운 확인", time: "5분 전", color: "from-purple-400 to-violet-500" },
];

export function RealtimeActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES.slice(0, 3));
  const [currentIndex, setCurrentIndex] = useState(3);

  useEffect(() => {
    // 5초마다 새 활동 추가 (무한 루프)
    const interval = setInterval(() => {
      setActivities((prev) => {
        const nextActivity = MOCK_ACTIVITIES[currentIndex % MOCK_ACTIVITIES.length];
        const newActivities = [nextActivity, ...prev.slice(0, 2)];
        return newActivities;
      });
      setCurrentIndex((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-white/60">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
          <h3 className="text-sm font-bold text-gray-900">실시간 활동</h3>
        </div>
        <div className="text-xs text-gray-500">지금 이용 중</div>
      </div>

      {/* Activity List */}
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div
            key={`${activity.id}-${index}`}
            className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-white to-gray-50 hover:shadow-md transition-all duration-300 animate-slide-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Icon */}
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${activity.color} flex items-center justify-center text-xl shadow-md`}>
              {activity.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                <span className="font-bold">{activity.name}</span>님이{" "}
                <span className="text-gray-700">{activity.action}</span>
              </p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>

            {/* Pulse indicator */}
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Stats */}
      <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-xs text-gray-500 mb-1">오늘</p>
          <p className="text-lg font-bold text-cosmic-purple">3,247명</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">평균 만족도</p>
          <p className="text-lg font-bold text-amber-500">4.9⭐</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">재방문율</p>
          <p className="text-lg font-bold text-green-600">89%</p>
        </div>
      </div>
    </div>
  );
}
