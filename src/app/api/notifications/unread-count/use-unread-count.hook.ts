import { useQuery } from "@tanstack/react-query";

import kyInstance from "@app/api/_core/ky";
import { NotificationCountInfo } from "@app/api/notifications/noti.prisma";

const fnUnreadCount = () =>
  kyInstance
    .get("/api/notifications/unread-count")
    .json<NotificationCountInfo>();

export const useUnreadCount = (initialState: NotificationCountInfo) => {
  const query = useQuery({
    queryKey: ["unread-notification-count"],
    queryFn: fnUnreadCount,
    initialData: initialState,
    // dùng long polling 6s fetch
    // vì btn mount vào side menu gần như cấp global
    // solution tạm ko quá hay
    refetchInterval: 60 * 1000,
  });

  return query;
};
