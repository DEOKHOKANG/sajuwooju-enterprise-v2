"use client";

import { User, Calendar, Award } from "lucide-react";

interface ProfileCardProps {
  user: {
    name: string;
    email?: string;
    profileImage?: string;
    joinDate: string;
    level?: number;
  };
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <div className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 overflow-hidden">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-400/20 via-purple-400/20 to-pink-400/20 backdrop-blur-xl" />
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />

      {/* Border glow */}
      <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-white/30" />

      <div className="relative z-10 flex items-center gap-4 sm:gap-6">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center border-4 border-white shadow-lg">
              <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">
            {user.name}
          </h3>

          {user.email && (
            <p className="text-sm text-gray-600 mb-2 truncate">{user.email}</p>
          )}

          <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{user.joinDate}</span>
            </div>

            {user.level && (
              <div className="flex items-center gap-1">
                <Award className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
                <span className="font-medium text-amber-600">Lv.{user.level}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
