"use client";

import { Bell } from "lucide-react";
import Link from "next/link";

import { NotificationCountInfo } from "@app/api/notifications/noti.prisma";
import { useUnreadCount } from "@app/api/notifications/unread-count/use-unread-count.hook";

import { Button } from "@core/app-shadcn/button";

interface NotificationsButtonProps {
  initialState: NotificationCountInfo;
}

export function NotificationsButton({
  initialState,
}: NotificationsButtonProps) {
  const { data } = useUnreadCount(initialState);

  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-3"
      title="Notifications"
      asChild
    >
      <Link href="/notifications">
        <div className="relative">
          <Bell />
          {!!data.unreadCount && (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
              {data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden lg:inline">Notifications</span>
      </Link>
    </Button>
  );
}
