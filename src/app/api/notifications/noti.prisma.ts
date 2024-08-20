import { Prisma } from "@prisma/client";

export const notificationsInclude = {
  issuer: {
    select: {
      username: true,
      displayName: true,
      avatarUrl: true,
    },
  },
  post: {
    select: {
      content: true,
    },
  },
} satisfies Prisma.NotificationInclude;

export type NotificationData = Prisma.NotificationGetPayload<{
  include: typeof notificationsInclude;
}>;

export type NotificationCursor = string | null;

export interface NotificationsPage {
  notifications: NotificationData[];
  nextCursor: NotificationCursor;
}

export interface NotificationCountInfo {
  unreadCount: number;
}
