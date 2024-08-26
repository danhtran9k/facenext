import { NotificationType } from "@prisma/client";
import { Heart, MessageCircle, User2 } from "lucide-react";

import { NotificationData } from "@app/api/notifications/noti.prisma";

import { PATH_URL } from "@core/path.const";

export const NotificationMap = (
  notification: NotificationData,
): Record<
  NotificationType,
  { message: string; icon: JSX.Element; href: string }
> => ({
  FOLLOW: {
    message: `${notification.issuer.displayName} followed you`,
    icon: <User2 className="size-7 text-primary" />,
    href: PATH_URL.userProfile(notification.issuer.username),
  },
  COMMENT: {
    message: `${notification.issuer.displayName} commented on your post`,
    icon: <MessageCircle className="size-7 fill-primary text-primary" />,
    href: PATH_URL.postItem(notification.postId),
  },
  LIKE: {
    message: `${notification.issuer.displayName} liked your post`,
    icon: <Heart className="size-7 fill-red-500 text-red-500" />,
    href: PATH_URL.postItem(notification.postId),
  },
});
