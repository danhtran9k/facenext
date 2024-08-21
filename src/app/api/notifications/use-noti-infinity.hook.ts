import { useInfiniteQuery } from "@tanstack/react-query";

import kyInstance from "@app/api/_core/ky";
import { keysNotifications } from "@app/api/_core/queryKey";
import {
  NotificationCursor,
  NotificationsPage,
} from "@app/api/notifications/noti.prisma";

const queryFn = ({ pageParam }: { pageParam: NotificationCursor }) =>
  kyInstance
    .get(
      keysNotifications.api,
      pageParam ? { searchParams: { cursor: pageParam } } : {},
    )
    .json<NotificationsPage>();

export const useNotiInfinity = () => {
  const query = useInfiniteQuery({
    queryKey: keysNotifications.key,
    queryFn: queryFn,
    initialPageParam: null as NotificationCursor,
    getNextPageParam: lastPage => lastPage.nextCursor,
  });

  return query;
};
