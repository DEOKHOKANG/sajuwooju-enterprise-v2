"use client";

import { useState, useEffect } from "react";
import { Bell, Check, Eye, Heart, Users, MessageCircle, Share2, X } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

// API에서 가져온 알림 타입
interface NotificationAPI {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  actorId: string | null;
  targetId: string | null;
  actionUrl: string | null;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export function Notifications() {
  const [notifications, setNotifications] = useState<NotificationAPI[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // API에서 알림 데이터 가져오기
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications');
        const data = await response.json();

        if (data.success) {
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount);
        } else {
          console.error('Failed to fetch notifications:', data.error);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const handleMarkAsRead = async (id: string) => {
    // Optimistic update
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));

    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
      });
      const data = await response.json();

      if (!data.success) {
        console.error('Failed to mark notification as read:', data.error);
        // Revert optimistic update
        setNotifications(notifications);
        setUnreadCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Revert optimistic update
      setNotifications(notifications);
      setUnreadCount(prev => prev + 1);
    }
  };

  const handleMarkAllAsRead = async () => {
    // Optimistic update
    const prevNotifications = notifications;
    const prevUnreadCount = unreadCount;
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
      });
      const data = await response.json();

      if (!data.success) {
        console.error('Failed to mark all notifications as read:', data.error);
        // Revert optimistic update
        setNotifications(prevNotifications);
        setUnreadCount(prevUnreadCount);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Revert optimistic update
      setNotifications(prevNotifications);
      setUnreadCount(prevUnreadCount);
    }
  };

  const handleDelete = async (id: string) => {
    // Optimistic update
    const prevNotifications = notifications;
    const deletedNotification = notifications.find(n => n.id === id);
    setNotifications(notifications.filter(n => n.id !== id));
    if (deletedNotification && !deletedNotification.isRead) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }

    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!data.success) {
        console.error('Failed to delete notification:', data.error);
        // Revert optimistic update
        setNotifications(prevNotifications);
        if (deletedNotification && !deletedNotification.isRead) {
          setUnreadCount(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      // Revert optimistic update
      setNotifications(prevNotifications);
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount(prev => prev + 1);
      }
    }
  };

  const getNotificationColor = (type: string): string => {
    switch (type) {
      case 'friend_request': return 'bg-blue-50 border-blue-200';
      case 'friend_accept': return 'bg-green-50 border-green-200';
      case 'follow': return 'bg-purple-50 border-purple-200';
      case 'like': return 'bg-pink-50 border-pink-200';
      case 'comment': return 'bg-violet-50 border-violet-200';
      case 'share': return 'bg-indigo-50 border-indigo-200';
      default: return 'bg-slate-50 border-slate-200';
    }
  };

  const getNotificationIcon = (type: string): string => {
    switch (type) {
      case 'friend_request': return '👥';
      case 'friend_accept': return '✅';
      case 'follow': return '👤';
      case 'like': return '❤️';
      case 'comment': return '💬';
      case 'share': return '🔗';
      case 'mention': return '📢';
      default: return '🔔';
    }
  };

  const getTimeAgo = (dateString: string): string => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ko,
      });
    } catch {
      return '방금 전';
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-violet-600" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
            알림
          </h2>
        </div>
        <div className="glass-card p-8 text-center">
          <div className="inline-block w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-slate-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-6 h-6 text-violet-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
            알림 ({unreadCount})
          </h2>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1"
          >
            <Check className="w-4 h-4" />
            <span>모두 읽음</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            filter === 'all'
              ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white'
              : 'glass-card text-slate-700 hover:bg-slate-100'
          }`}
        >
          전체 ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            filter === 'unread'
              ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white'
              : 'glass-card text-slate-700 hover:bg-slate-100'
          }`}
        >
          읽지 않음 ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <Bell className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-slate-600">
            {filter === 'unread' ? '읽지 않은 알림이 없습니다' : '알림이 없습니다'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`glass-card p-4 transition-all relative group ${
                !notification.isRead ? 'border-2 ' + getNotificationColor(notification.type) : ''
              }`}
            >
              {/* Unread Indicator */}
              {!notification.isRead && (
                <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}

              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-400 flex items-center justify-center text-2xl">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800 mb-0.5">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {notification.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <p className="text-xs text-slate-500">
                      {getTimeAgo(notification.createdAt)}
                    </p>

                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-xs text-violet-600 hover:text-violet-700 font-medium"
                      >
                        읽음 표시
                      </button>
                    )}

                    {notification.actionUrl && (
                      <Link
                        href={notification.actionUrl}
                        className="text-xs text-violet-600 hover:text-violet-700 font-medium"
                      >
                        자세히 보기 →
                      </Link>
                    )}
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(notification.id)}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded-lg transition-all"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Settings Info */}
      <div className="glass-card p-4 bg-slate-50">
        <p className="text-sm text-slate-600">
          💡 <span className="font-medium">알림 설정:</span> 친구가 내 사주를 조회하거나 좋아요를 누르면 실시간으로 알림을 받습니다
        </p>
      </div>
    </div>
  );
}
