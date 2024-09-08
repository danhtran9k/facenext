import { useQuery } from "@tanstack/react-query";

import { POOLING_INTERVAL } from "@app/api/_core/api.common";
import kyInstance from "@app/api/_core/ky";
import { keysNotifications } from "@app/api/_core/queryKey";

import { NotificationCountInfo } from "@app/api/notifications/noti.prisma";

const fnUnreadCount = () =>
  kyInstance.get(keysNotifications.unread.api).json<NotificationCountInfo>();

export const useUnreadCount = (initialState: NotificationCountInfo) => {
  const query = useQuery({
    queryKey: keysNotifications.unread.key,
    queryFn: fnUnreadCount,
    initialData: initialState,
    // dùng long polling 6s fetch
    // vì btn mount vào side menu gần như cấp global
    // solution tạm ko quá hay
    // Tạm set cao để tránh network dump khó debug
    refetchInterval: POOLING_INTERVAL * 10,
  });

  return query;
};
