'use client';

import { useState, useEffect } from 'react';

interface FollowUser {
  id: string;
  name: string | null;
  image: string | null;
  email: string | null;
  followedAt: string;
  isFollowingBack?: boolean;
}

interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasMore: boolean;
}

interface UseFollowDataResult {
  users: FollowUser[];
  pagination: PaginationInfo | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFollowers(
  userId?: string,
  page: number = 1,
  limit: number = 20
): UseFollowDataResult {
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFollowers = async () => {
    if (!userId) {
      setUsers([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/follow/followers?userId=${userId}&page=${page}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch followers');
      }

      const data = await response.json();

      if (data.success) {
        const followersData = data.data.followers.map((follower: any) => ({
          id: follower.user.id,
          name: follower.user.name,
          image: follower.user.image,
          email: follower.user.email,
          followedAt: follower.followedAt,
          isFollowingBack: follower.isFollowingBack,
        }));

        setUsers(followersData);
        setPagination(data.data.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('[useFollowers Error]', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowers();
  }, [userId, page, limit]);

  return {
    users,
    pagination,
    isLoading,
    error,
    refetch: fetchFollowers,
  };
}

export function useFollowing(
  userId?: string,
  page: number = 1,
  limit: number = 20
): UseFollowDataResult {
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFollowing = async () => {
    if (!userId) {
      setUsers([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/follow/following?userId=${userId}&page=${page}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch following');
      }

      const data = await response.json();

      if (data.success) {
        const followingData = data.data.following.map((following: any) => ({
          id: following.user.id,
          name: following.user.name,
          image: following.user.image,
          email: following.user.email,
          followedAt: following.followedAt,
        }));

        setUsers(followingData);
        setPagination(data.data.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('[useFollowing Error]', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowing();
  }, [userId, page, limit]);

  return {
    users,
    pagination,
    isLoading,
    error,
    refetch: fetchFollowing,
  };
}
