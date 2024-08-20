"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import kyInstance from "@app/api/_core/ky";

const mutateFn = () => kyInstance.patch("/api/notifications/mark-as-read");

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: mutateFn,
    onSuccess: () => {
      queryClient.setQueryData(["unread-notification-count"], {
        unreadCount: 0,
      });
    },
    onError(error) {
      console.error("Failed to mark notifications as read", error);
    },
  });

  return mutate;
};
