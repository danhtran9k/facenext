import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useChatContext } from "stream-chat-react";

import { keysStreamChat } from "@app/api/_core/queryKey";

export const useRefetchUnreadCount = () => {
  const queryClient = useQueryClient();

  const { channel } = useChatContext();

  // idea là khi chuyển channel thì refetch query ở global sidebar
  // Tuy nhiên phải handle hết các TH ví dụ tự mark-unread ... => yếu điểm của vendor
  useEffect(() => {
    if (channel?.id) {
      queryClient.invalidateQueries({
        queryKey: keysStreamChat.unreadCount.key,
      });
    }
  }, [channel?.id, queryClient]);
};
