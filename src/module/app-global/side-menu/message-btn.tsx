"use client";

import { Mail } from "lucide-react";

import { NotificationCountInfo } from "@app/api/notifications/noti.prisma";
import { useUnreadCount } from "@app/api/notifications/unread-count/use-unread-count.hook";

import { UnreadCountBtn } from "@module/app-common/unread-count-btn";

interface NotificationsButtonProps {
  initialState: NotificationCountInfo;
}

export function MessagesButton({ initialState }: NotificationsButtonProps) {
  const { data } = useUnreadCount(initialState);

  return (
    <UnreadCountBtn
      count={data.unreadCount}
      link="/messages"
      title="Messages"
      icon={<Mail />}
    />
  );
}
