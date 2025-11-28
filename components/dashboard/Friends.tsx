"use client";

import { useState, useEffect } from "react";
import { Users, UserPlus, Check, X, Search, MoreVertical, Loader2, Trash2 } from "lucide-react";

/**
 * Friends Component - API Integrated Version
 *
 * Features:
 * - Fetch friends list from API
 * - Fetch received friend requests from API
 * - Accept/reject friend requests
 * - Delete friends
 * - Search for users (TODO: needs user search API)
 *
 * API Endpoints Used:
 * - GET /api/friends - Get friends list
 * - GET /api/friends/requests - Get received requests
 * - POST /api/friends/[requestId]/accept - Accept request
 * - POST /api/friends/[requestId]/reject - Reject request
 * - DELETE /api/friends/[userId] - Delete friend
 */

interface FriendUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  friendCount?: number;
  followerCount?: number;
}

interface FriendRequest {
  id: string;
  createdAt: string;
  requester: FriendUser;
}

export function Friends() {
  // State
  const [friends, setFriends] = useState<FriendUser[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingFriend, setIsAddingFriend] = useState(false);

  // Loading states
  const [isLoadingFriends, setIsLoadingFriends] = useState(true);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(null);
  const [deletingFriendId, setDeletingFriendId] = useState<string | null>(null);

  // Fetch friends list on mount
  useEffect(() => {
    fetchFriends();
  }, []);

  // Fetch received friend requests on mount
  useEffect(() => {
    fetchRequests();
  }, []);

  // Fetch friends list
  const fetchFriends = async () => {
    setIsLoadingFriends(true);
    try {
      const response = await fetch('/api/friends');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFriends(data.data || []);
        }
      }
    } catch (error) {
      console.error('Failed to fetch friends:', error);
    } finally {
      setIsLoadingFriends(false);
    }
  };

  // Fetch received friend requests
  const fetchRequests = async () => {
    setIsLoadingRequests(true);
    try {
      const response = await fetch('/api/friends/requests');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setRequests(data.data || []);
        }
      }
    } catch (error) {
      console.error('Failed to fetch friend requests:', error);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  // Accept friend request
  const handleAcceptRequest = async (requestId: string) => {
    setProcessingRequestId(requestId);
    try {
      const response = await fetch(`/api/friends/${requestId}/accept`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to accept request');
      }

      const data = await response.json();

      if (data.success) {
        // Remove from requests list
        setRequests(requests.filter(r => r.id !== requestId));

        // Refresh friends list
        fetchFriends();

        alert(data.message || '친구 요청을 수락했습니다.');
      }
    } catch (error) {
      console.error('Accept request error:', error);
      const errorMessage = error instanceof Error ? error.message : '친구 요청 수락 중 오류가 발생했습니다.';
      alert(errorMessage);
    } finally {
      setProcessingRequestId(null);
    }
  };

  // Reject friend request
  const handleRejectRequest = async (requestId: string) => {
    if (!confirm('이 친구 요청을 거절하시겠습니까?')) {
      return;
    }

    setProcessingRequestId(requestId);
    try {
      const response = await fetch(`/api/friends/${requestId}/reject`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reject request');
      }

      const data = await response.json();

      if (data.success) {
        // Remove from requests list
        setRequests(requests.filter(r => r.id !== requestId));
        alert(data.message || '친구 요청을 거절했습니다.');
      }
    } catch (error) {
      console.error('Reject request error:', error);
      const errorMessage = error instanceof Error ? error.message : '친구 요청 거절 중 오류가 발생했습니다.';
      alert(errorMessage);
    } finally {
      setProcessingRequestId(null);
    }
  };

  // Delete friend
  const handleDeleteFriend = async (friendId: string, friendName: string | null) => {
    if (!confirm(`${friendName || '이 사용자'}와(과)의 친구 관계를 삭제하시겠습니까?`)) {
      return;
    }

    setDeletingFriendId(friendId);
    try {
      const response = await fetch(`/api/friends/${friendId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete friend');
      }

      const data = await response.json();

      if (data.success) {
        // Remove from friends list
        setFriends(friends.filter(f => f.id !== friendId));
        alert(data.message || '친구를 삭제했습니다.');
      }
    } catch (error) {
      console.error('Delete friend error:', error);
      const errorMessage = error instanceof Error ? error.message : '친구 삭제 중 오류가 발생했습니다.';
      alert(errorMessage);
    } finally {
      setDeletingFriendId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-violet-600" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
            친구 ({isLoadingFriends ? '...' : friends.length})
          </h2>
        </div>
        <button
          onClick={() => setIsAddingFriend(!isAddingFriend)}
          className="glass-button p-2 sm:px-4 sm:py-2 rounded-xl hover:scale-105 transition-all"
        >
          <UserPlus className="w-5 h-5 sm:mr-2 text-violet-600" />
          <span className="hidden sm:inline text-sm font-medium">친구 추가</span>
        </button>
      </div>

      {/* Add Friend Form */}
      {isAddingFriend && (
        <div className="glass-card p-4 sm:p-6 space-y-4">
          <h3 className="font-bold text-slate-800">친구 추가</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="이메일 또는 사용자 이름으로 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
              disabled
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium hover:from-violet-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="사용자 검색 기능은 곧 추가될 예정입니다"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-slate-500">
            * 사용자 검색 기능은 곧 추가될 예정입니다
          </p>
        </div>
      )}

      {/* Friend Requests */}
      {isLoadingRequests ? (
        <div className="glass-card p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-violet-600" />
            <h3 className="font-bold text-slate-800">친구 요청 로딩 중...</h3>
          </div>
        </div>
      ) : requests.length > 0 ? (
        <div className="glass-card p-4 sm:p-6 space-y-4">
          <h3 className="font-bold text-slate-800">친구 요청 ({requests.length})</h3>
          <div className="space-y-3">
            {requests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-3 rounded-xl bg-violet-50 border border-violet-200"
              >
                <div className="flex items-center gap-3">
                  {request.requester.image ? (
                    <img
                      src={request.requester.image}
                      alt={request.requester.name || '사용자'}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-400 flex items-center justify-center text-white font-bold">
                      {request.requester.name?.charAt(0) || '?'}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-slate-800">
                      {request.requester.name || '이름 없음'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {request.requester.email || ''}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcceptRequest(request.id)}
                    disabled={processingRequestId === request.id}
                    className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="수락"
                  >
                    {processingRequestId === request.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request.id)}
                    disabled={processingRequestId === request.id}
                    className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="거절"
                  >
                    {processingRequestId === request.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Friends List */}
      <div className="glass-card p-4 sm:p-6 space-y-4">
        <h3 className="font-bold text-slate-800">내 친구</h3>

        {isLoadingFriends ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
          </div>
        ) : friends.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">아직 친구가 없습니다</p>
            <p className="text-xs mt-1">친구를 추가하고 사주를 공유해보세요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="group flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {friend.image ? (
                    <img
                      src={friend.image}
                      alt={friend.name || '사용자'}
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {friend.name?.charAt(0) || '?'}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-800 truncate">
                      {friend.name || '이름 없음'}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {friend.email || ''}
                    </p>
                  </div>
                </div>
                <div className="relative group/menu">
                  <button
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-100 rounded-lg transition-all"
                    onClick={(e) => {
                      e.currentTarget.nextElementSibling?.classList.toggle('hidden');
                    }}
                  >
                    <MoreVertical className="w-4 h-4 text-slate-400" />
                  </button>
                  {/* Dropdown Menu */}
                  <div className="hidden absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                    <button
                      onClick={() => {
                        handleDeleteFriend(friend.id, friend.name);
                      }}
                      disabled={deletingFriendId === friend.id}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {deletingFriendId === friend.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>삭제 중...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          <span>친구 삭제</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
