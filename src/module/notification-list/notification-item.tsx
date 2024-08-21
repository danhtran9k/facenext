import Link from "next/link";

import { NotificationData } from "@app/api/notifications/noti.prisma";

import { cn } from "@core/utils";

import { UserAvatar } from "@module/app-global/navbar";

import { NotificationMap } from "./notification-item.map";

interface NotificationItemProps {
  notification: NotificationData;
}

// TODO: có cách nào viết ổn hơn ko
// Hoặc dùng useMemo
export function NotificationItem({ notification }: NotificationItemProps) {
  const { message, icon, href } =
    NotificationMap(notification)[notification.type];

  return (
    <Link href={href} className="block">
      <article
        className={cn(
          "flex gap-3 rounded-2xl bg-card p-5 shadow-sm transition-colors hover:bg-card/70",
          !notification.read && "bg-primary/10",
        )}
      >
        <div className="my-1">{icon}</div>
        <div className="space-y-3">
          <UserAvatar avatarUrl={notification.issuer.avatarUrl} size={36} />
          <div>
            <span className="font-bold">{notification.issuer.displayName}</span>{" "}
            <span>{message}</span>
          </div>
          {notification.post && (
            <div className="line-clamp-3 whitespace-pre-line text-muted-foreground">
              {notification.post.content}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
