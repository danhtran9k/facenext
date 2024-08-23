"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import kyInstance from "@app/api/_core/ky";
import { keysNotifications } from "@app/api/_core/queryKey";

const mutateFn = () => kyInstance.patch("/api/notifications/mark-as-read");

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: mutateFn,
    onSuccess: () => {
      // Concept - marked read ngay lập tức khi vừa vào trang dù user chưa check hết
      // UX cực kì tệ, nếu ko check kịp thì logic đang ko có query load readed noti
      // Hoặc setup ra 1 Tab để fetch lại toàn bộ noti cũ ?
      // Tùy mức độ noti, data ko quá quan trọng, ko phải coreMVP

      // TODO: Có thể improve -> check sau
      // Hoặc option2: cho phép load previous noti
      // Noti sẽ có từng btn load more để mark là read + 1 btn mark read all
      queryClient.setQueryData(keysNotifications.unread.key, {
        unreadCount: 0,
      });
    },
    onError(error) {
      console.error("Failed to mark notifications as read", error);
    },
  });

  return mutate;
};
