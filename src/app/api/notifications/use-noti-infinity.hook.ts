import { useInfiniteQuery } from "@tanstack/react-query";

import kyInstance from "@app/api/_core/ky";
import {
  NotificationCursor,
  NotificationsPage,
} from "@app/api/notifications/noti.prisma";

const queryFn = ({ pageParam }: { pageParam: NotificationCursor }) =>
  kyInstance
    .get(
      "/api/notifications",
      pageParam ? { searchParams: { cursor: pageParam } } : {},
    )
    .json<NotificationsPage>();

export const useNotiInfinity = () => {
  const query = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: queryFn,
    initialPageParam: null as NotificationCursor,
    getNextPageParam: lastPage => lastPage.nextCursor,
  });

  return query;
};
