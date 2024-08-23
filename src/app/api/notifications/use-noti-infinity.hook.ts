import { useInfiniteQuery } from "@tanstack/react-query";

import { IS_POOLING, POOLING_INTERVAL } from "@app/api/_core/api.common";
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
    staleTime: 1000,
    // stale sẽ chỉ re-fetch khi re-focus tab
    // Nếu muốn polling thì dùng refetchInterval,
    // Xài thì network call khó debug
    // Tuy nhiên vì scroll infinity + manual setQueriesData nên tự refetch đồng nghĩa refetch all page
    // Với các data ít thường xuyên clear như noti thì có thể UX đỡ
    // Đang scroll xong bị refetch và noti đã read bị clear sạch rất ko hay
    // ===============================
    // WARNING
    // Chỉ demo concept, tốt nhất ko nên tự bật lên
    // Hoặc nếu có chăng tự fetch mới, manual so sánh newest hoặc oldest với nhau và manual update tay => TRADE-OFF
    refetchInterval: IS_POOLING && POOLING_INTERVAL,
  });

  return query;
};
