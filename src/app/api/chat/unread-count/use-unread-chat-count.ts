import { useQuery } from "@tanstack/react-query";

import { POOLING_INTERVAL } from "@app/api/_core/api.common";
import kyInstance from "@app/api/_core/ky";
import { keysStreamChat } from "@app/api/_core/queryKey";

import { UnreadChatCount } from "@app/api/chat/getStream.type";

const queryUnreadChatFn = () =>
  kyInstance.get(keysStreamChat.unreadCount.api).json<UnreadChatCount>();

export const useUnreadChatCount = (initialState: UnreadChatCount) => {
  const query = useQuery({
    queryKey: keysStreamChat.unreadCount.key,
    queryFn: queryUnreadChatFn,
    initialData: initialState,
    refetchInterval: POOLING_INTERVAL * 10,
  });

  return query;
};
