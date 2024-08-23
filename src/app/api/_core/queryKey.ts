import { QueryFilters } from "@tanstack/react-query";

export const keysNotifications = {
  key: ["notifications"],
  api: "/api/notifications",

  unread: {
    key: ["unread-notification-count"],
    api: "/api/notifications/unread-count",
  } as const,
} as const;

// Chỗ này nên chuyển function thành object
// khi nào key hoặc api cần gọi mới truyền params vào sẽ hay hơn
// Tuy nhiên TRADE_OFF là nếu nested quá thì parasm nhiều lên
export const keysPostFeed = {
  key: ["post-feed"] as const,

  bookmarks: {
    key: () => [...keysPostFeed.key, "bookmarks"] as const,
    api: "/api/posts/bookmarked",
  } as const,

  following: {
    key: () => [...keysPostFeed.key, "following"] as const,
    api: "/api/posts/following",
  } as const,

  forYou: {
    key: () => [...keysPostFeed.key, "for-you"] as const,
    api: "/api/posts/for-you",
  } as const,

  userPost: {
    key: (userId: string) =>
      [...keysPostFeed.key, "user-posts", userId] as const,
    api: (userId: string) => `/api/users/${userId}/posts`,
  } as const,
};

export const invalidateQueryPostSubmitFilter = (userId: string) =>
  ({
    queryKey: keysPostFeed.key,
    predicate(query) {
      return (
        query.queryKey.includes("for-you") ||
        (query.queryKey.includes("user-posts") &&
          query.queryKey.includes(userId))
      );
    },
  }) satisfies QueryFilters;

export const keysBookmarksInfo = {
  key: (postId: string) => ["bookmarks-info", postId] as const,
  api: (postId: string) => `/api/posts/${postId}/bookmark`,
} as const;

export const keysComment = {
  key: (postId: string) => ["comment", postId] as const,
  api: (postId: string) => `/api/posts/${postId}/comment`,
} as const;

export const keysLikeInfo = {
  key: (postId: string) => ["like-info", postId] as const,
  api: (postId: string) => `/api/posts/${postId}/likes`,
} as const;

export const keysFollowInfo = {
  key: (userId: string) => ["follower-info", userId] as const,
  api: (userId: string) => `/api/users/${userId}/followers`,
} as const;

export const keysUser = {
  key: (userNameOrId: string) => ["user-data", userNameOrId] as const,
  api: (userNameOrId: string) => `/api/users/${userNameOrId}`,
} as const;

export const keysStreamChat = {
  api: "/api/chat-token",
} as const;
