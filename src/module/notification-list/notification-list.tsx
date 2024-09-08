"use client";

import { Loader2 } from "lucide-react";
import { useEffect } from "react";


import { useMarkAsRead } from "@app/api/notifications/mark-as-read/use-mark-as-read.hook";
import { useNotiInfinity } from "@app/api/notifications/use-noti-infinity.hook";

import InfiniteScrollContainer from "@module/app-vendor/InfiniteScrollContainer";

import { PostsLoadingSkeleton } from "@module/post-item";

import { NotificationItem } from "./notification-item";

export function NotificationList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useNotiInfinity();

  const { mutate } = useMarkAsRead();

  // Ý tưởng tạm basic là khi vào trang list noti
  // -> tự mark tất cả là read
  useEffect(() => {
    mutate();
  }, [mutate]);

  const notifications = data?.pages.flatMap(page => page.notifications) || [];

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && !notifications.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        You don&apos;t have any notifications yet.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading notifications.
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {notifications.map(notification => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}
