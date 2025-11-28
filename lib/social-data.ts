/**
 * Social Features Data Models
 * 친구 관리 및 사주 공유 기능
 */

// Friend Request Status
export type FriendRequestStatus = 'pending' | 'accepted' | 'rejected';

// Saju Privacy Level
export type SajuPrivacyLevel = 'private' | 'friends' | 'public';

// Friend Interface
export interface Friend {
  id: string;
  userId: string;
  name: string;
  email: string;
  profileImage: string;
  status: FriendRequestStatus;
  createdAt: string;
  mutualFriends?: number;
}

// Saju Analysis Interface
export interface SajuAnalysis {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  category: string;
  categoryIcon: string;
  title: string;
  date: string;
  privacy: SajuPrivacyLevel;
  viewCount: number;
  likeCount: number;
  isLiked: boolean;
  canView: boolean; // 현재 사용자가 볼 수 있는지
}

// Mock Data - Friends
export const MOCK_FRIENDS: Friend[] = [
  {
    id: 'f1',
    userId: 'user1',
    name: '김민지',
    email: 'minji@example.com',
    profileImage: '',
    status: 'accepted',
    createdAt: '2025-01-15',
    mutualFriends: 3,
  },
  {
    id: 'f2',
    userId: 'user2',
    name: '박서준',
    email: 'seojun@example.com',
    profileImage: '',
    status: 'accepted',
    createdAt: '2025-02-20',
    mutualFriends: 5,
  },
  {
    id: 'f3',
    userId: 'user3',
    name: '이하늘',
    email: 'haneul@example.com',
    profileImage: '',
    status: 'pending',
    createdAt: '2025-03-10',
    mutualFriends: 1,
  },
];

// Mock Data - Friend Requests
export const MOCK_FRIEND_REQUESTS: Friend[] = [
  {
    id: 'fr1',
    userId: 'user4',
    name: '최유진',
    email: 'yujin@example.com',
    profileImage: '',
    status: 'pending',
    createdAt: '2025-03-15',
    mutualFriends: 2,
  },
];

// Mock Data - Shared Saju (친구들의 공개된 사주)
export const MOCK_SHARED_SAJU: SajuAnalysis[] = [
  {
    id: 's1',
    userId: 'user1',
    userName: '김민지',
    userImage: '',
    category: '연애운',
    categoryIcon: '💕',
    title: '2025년 봄 연애운세',
    date: '2025-03-01',
    privacy: 'friends',
    viewCount: 12,
    likeCount: 5,
    isLiked: false,
    canView: true,
  },
  {
    id: 's2',
    userId: 'user2',
    userName: '박서준',
    userImage: '',
    category: '재물운',
    categoryIcon: '💰',
    title: '3월 재물운 분석',
    date: '2025-03-05',
    privacy: 'friends',
    viewCount: 8,
    likeCount: 3,
    isLiked: true,
    canView: true,
  },
  {
    id: 's3',
    userId: 'user3',
    userName: '이하늘',
    userImage: '',
    category: '직업운',
    categoryIcon: '💼',
    title: '커리어 운세 보기',
    date: '2025-03-10',
    privacy: 'private',
    viewCount: 0,
    likeCount: 0,
    isLiked: false,
    canView: false, // Private - 볼 수 없음
  },
];

// Mock Data - My Saju Analyses (내 사주 분석 내역)
export const MOCK_MY_SAJU: SajuAnalysis[] = [
  {
    id: 'my1',
    userId: 'test',
    userName: '테스트 사용자',
    userImage: '',
    category: '종합분석',
    categoryIcon: '🌟',
    title: '2025년 운세 종합',
    date: '2025-01-01',
    privacy: 'friends',
    viewCount: 24,
    likeCount: 8,
    isLiked: false,
    canView: true,
  },
  {
    id: 'my2',
    userId: 'test',
    userName: '테스트 사용자',
    userImage: '',
    category: '연애운',
    categoryIcon: '💕',
    title: '봄 연애운세',
    date: '2025-02-14',
    privacy: 'public',
    viewCount: 45,
    likeCount: 12,
    isLiked: false,
    canView: true,
  },
  {
    id: 'my3',
    userId: 'test',
    userName: '테스트 사용자',
    userImage: '',
    category: '재물운',
    categoryIcon: '💰',
    title: '3월 금전운',
    date: '2025-03-01',
    privacy: 'private',
    viewCount: 0,
    likeCount: 0,
    isLiked: false,
    canView: true,
  },
];

// ============================================
// RANKING SYSTEM
// ============================================

// Ranking Entry
export interface RankingEntry {
  rank: number;
  userId: string;
  userName: string;
  userImage: string;
  sajuId: string;
  sajuTitle: string;
  category: string;
  categoryIcon: string;
  score: number; // Based on views + likes + comments
  viewCount: number;
  likeCount: number;
  commentCount: number;
  date: string;
}

// Mock Data - Rankings by Category
export const MOCK_RANKINGS: Record<string, RankingEntry[]> = {
  '연애운': [
    {
      rank: 1,
      userId: 'user5',
      userName: '최연애',
      userImage: '',
      sajuId: 'rank1',
      sajuTitle: '2025년 최고의 연애운',
      category: '연애운',
      categoryIcon: '💕',
      score: 950,
      viewCount: 450,
      likeCount: 350,
      commentCount: 150,
      date: '2025-02-14',
    },
    {
      rank: 2,
      userId: 'user6',
      userName: '박사랑',
      userImage: '',
      sajuId: 'rank2',
      sajuTitle: '인연의 흐름이 좋은 해',
      category: '연애운',
      categoryIcon: '💕',
      score: 820,
      viewCount: 380,
      likeCount: 290,
      commentCount: 150,
      date: '2025-02-10',
    },
    {
      rank: 3,
      userId: 'user7',
      userName: '김하트',
      userImage: '',
      sajuId: 'rank3',
      sajuTitle: '봄에 피는 사랑',
      category: '연애운',
      categoryIcon: '💕',
      score: 750,
      viewCount: 320,
      likeCount: 280,
      commentCount: 150,
      date: '2025-03-01',
    },
  ],
  '재물운': [
    {
      rank: 1,
      userId: 'user8',
      userName: '부자될사람',
      userImage: '',
      sajuId: 'rank4',
      sajuTitle: '대박나는 금전운',
      category: '재물운',
      categoryIcon: '💰',
      score: 1200,
      viewCount: 550,
      likeCount: 450,
      commentCount: 200,
      date: '2025-01-01',
    },
    {
      rank: 2,
      userId: 'user9',
      userName: '돈복터진사람',
      userImage: '',
      sajuId: 'rank5',
      sajuTitle: '재물이 흘러들어오는 해',
      category: '재물운',
      categoryIcon: '💰',
      score: 980,
      viewCount: 480,
      likeCount: 350,
      commentCount: 150,
      date: '2025-01-15',
    },
  ],
  '직업운': [
    {
      rank: 1,
      userId: 'user10',
      userName: '승진왕',
      userImage: '',
      sajuId: 'rank6',
      sajuTitle: '커리어 대도약의 해',
      category: '직업운',
      categoryIcon: '💼',
      score: 890,
      viewCount: 420,
      likeCount: 320,
      commentCount: 150,
      date: '2025-01-05',
    },
  ],
};

// Get top rankings across all categories
export const getTopRankings = (limit: number = 10): RankingEntry[] => {
  const allRankings = Object.values(MOCK_RANKINGS).flat();
  return allRankings
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
};

// ============================================
// NOTIFICATION SYSTEM
// ============================================

// Notification Interface
export interface Notification {
  id: string;
  type: 'friend_request' | 'friend_accept' | 'saju_view' | 'saju_like' | 'comment' | 'share';
  fromUserId: string;
  fromUserName: string;
  fromUserImage: string;
  targetId?: string; // sajuId or friendRequestId
  targetTitle?: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

// Mock Data - Notifications
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif1',
    type: 'saju_view',
    fromUserId: 'user1',
    fromUserName: '김민지',
    fromUserImage: '',
    targetId: 'my1',
    targetTitle: '2025년 운세 종합',
    message: '김민지님이 회원님의 사주를 조회했습니다',
    createdAt: '2025-03-15T10:30:00',
    isRead: false,
  },
  {
    id: 'notif2',
    type: 'saju_like',
    fromUserId: 'user2',
    fromUserName: '박서준',
    fromUserImage: '',
    targetId: 'my2',
    targetTitle: '봄 연애운세',
    message: '박서준님이 회원님의 사주를 좋아합니다',
    createdAt: '2025-03-15T09:15:00',
    isRead: false,
  },
  {
    id: 'notif3',
    type: 'friend_request',
    fromUserId: 'user4',
    fromUserName: '최유진',
    fromUserImage: '',
    message: '최유진님이 친구 요청을 보냈습니다',
    createdAt: '2025-03-14T18:20:00',
    isRead: false,
  },
  {
    id: 'notif4',
    type: 'friend_accept',
    fromUserId: 'user1',
    fromUserName: '김민지',
    fromUserImage: '',
    message: '김민지님이 친구 요청을 수락했습니다',
    createdAt: '2025-03-14T15:00:00',
    isRead: true,
  },
  {
    id: 'notif5',
    type: 'comment',
    fromUserId: 'user3',
    fromUserName: '이하늘',
    fromUserImage: '',
    targetId: 'my1',
    targetTitle: '2025년 운세 종합',
    message: '이하늘님이 댓글을 남겼습니다',
    createdAt: '2025-03-13T12:45:00',
    isRead: true,
  },
];

// Get unread notification count
export const getUnreadCount = (notifications: Notification[]): number => {
  return notifications.filter(n => !n.isRead).length;
};

// Get notification icon
export const getNotificationIcon = (type: Notification['type']): string => {
  switch (type) {
    case 'friend_request': return '👥';
    case 'friend_accept': return '✅';
    case 'saju_view': return '👀';
    case 'saju_like': return '❤️';
    case 'comment': return '💬';
    case 'share': return '🔗';
  }
};
