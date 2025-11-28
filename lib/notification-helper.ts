/**
 * Notification Helper Functions
 * 알림 생성 및 관리를 위한 헬퍼 함수들
 */

import { prisma } from '@/lib/prisma';

/**
 * 알림 타입 정의
 */
export type NotificationType =
  | 'friend_request'    // 친구 요청
  | 'friend_accept'     // 친구 수락
  | 'follow'            // 팔로우
  | 'like'              // 좋아요
  | 'comment'           // 댓글
  | 'share'             // 공유
  | 'mention';          // 멘션

/**
 * 알림 생성 인터페이스
 */
export interface CreateNotificationParams {
  userId: string;           // 알림을 받을 사용자 ID
  type: NotificationType;   // 알림 타입
  title: string;            // 알림 제목
  message: string;          // 알림 메시지
  actorId?: string;         // 행동을 한 사용자 ID
  targetId?: string;        // 대상 ID (사주 분석 ID, 댓글 ID 등)
  actionUrl?: string;       // 클릭 시 이동할 URL
}

/**
 * 알림 생성 함수
 */
export async function createNotification(params: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        actorId: params.actorId,
        targetId: params.targetId,
        actionUrl: params.actionUrl,
      },
    });

    console.log('[Notification Created]', {
      id: notification.id,
      type: notification.type,
      userId: notification.userId,
    });

    return notification;
  } catch (error) {
    console.error('[Create Notification Error]', error);
    throw error;
  }
}

/**
 * 친구 요청 알림 생성
 */
export async function notifyFriendRequest(params: {
  userId: string;       // 요청을 받는 사람
  actorId: string;      // 요청을 보낸 사람
  actorName: string;    // 요청을 보낸 사람 이름
  friendId: string;     // Friend 레코드 ID
}) {
  return createNotification({
    userId: params.userId,
    type: 'friend_request',
    title: '새로운 친구 요청',
    message: `${params.actorName}님이 친구 요청을 보냈습니다.`,
    actorId: params.actorId,
    targetId: params.friendId,
    actionUrl: `/social/friends`,
  });
}

/**
 * 친구 수락 알림 생성
 */
export async function notifyFriendAccept(params: {
  userId: string;       // 요청을 보낸 사람 (이제 친구가 됨)
  actorId: string;      // 수락한 사람
  actorName: string;    // 수락한 사람 이름
}) {
  return createNotification({
    userId: params.userId,
    type: 'friend_accept',
    title: '친구 요청 수락됨',
    message: `${params.actorName}님이 친구 요청을 수락했습니다.`,
    actorId: params.actorId,
    actionUrl: `/social/friends`,
  });
}

/**
 * 팔로우 알림 생성
 */
export async function notifyFollow(params: {
  userId: string;       // 팔로우 당한 사람
  actorId: string;      // 팔로우 한 사람
  actorName: string;    // 팔로우 한 사람 이름
}) {
  return createNotification({
    userId: params.userId,
    type: 'follow',
    title: '새로운 팔로워',
    message: `${params.actorName}님이 회원님을 팔로우하기 시작했습니다.`,
    actorId: params.actorId,
    actionUrl: `/profile/${params.actorId}`,
  });
}

/**
 * 좋아요 알림 생성
 */
export async function notifyLike(params: {
  userId: string;       // 사주 분석 작성자
  actorId: string;      // 좋아요 누른 사람
  actorName: string;    // 좋아요 누른 사람 이름
  targetId: string;     // 사주 분석 ID
  targetTitle: string;  // 사주 분석 제목
}) {
  return createNotification({
    userId: params.userId,
    type: 'like',
    title: '새로운 좋아요',
    message: `${params.actorName}님이 "${params.targetTitle}"을 좋아합니다.`,
    actorId: params.actorId,
    targetId: params.targetId,
    actionUrl: `/saju/result/${params.targetId}`,
  });
}

/**
 * 공유 알림 생성
 */
export async function notifyShare(params: {
  userId: string;       // 사주 분석 작성자
  actorId: string;      // 공유한 사람
  actorName: string;    // 공유한 사람 이름
  targetId: string;     // 사주 분석 ID
  targetTitle: string;  // 사주 분석 제목
}) {
  return createNotification({
    userId: params.userId,
    type: 'share',
    title: '분석이 공유되었습니다',
    message: `${params.actorName}님이 "${params.targetTitle}"을 공유했습니다.`,
    actorId: params.actorId,
    targetId: params.targetId,
    actionUrl: `/saju/result/${params.targetId}`,
  });
}

/**
 * 댓글 알림 생성
 */
export async function notifyComment(params: {
  userId: string;       // 사주 분석 작성자
  actorId: string;      // 댓글 작성자
  actorName: string;    // 댓글 작성자 이름
  targetId: string;     // 사주 분석 ID
  targetTitle: string;  // 사주 분석 제목
  commentId: string;    // 댓글 ID
}) {
  return createNotification({
    userId: params.userId,
    type: 'comment',
    title: '새로운 댓글',
    message: `${params.actorName}님이 "${params.targetTitle}"에 댓글을 남겼습니다.`,
    actorId: params.actorId,
    targetId: params.commentId,
    actionUrl: `/saju/result/${params.targetId}#comment-${params.commentId}`,
  });
}

/**
 * 대량 알림 읽음 처리
 */
export async function markNotificationsAsRead(userId: string, notificationIds: string[]) {
  try {
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        id: { in: notificationIds },
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return result.count;
  } catch (error) {
    console.error('[Mark Notifications Read Error]', error);
    throw error;
  }
}

/**
 * 읽지 않은 알림 개수 조회
 */
export async function getUnreadNotificationCount(userId: string) {
  try {
    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return count;
  } catch (error) {
    console.error('[Get Unread Count Error]', error);
    throw error;
  }
}
