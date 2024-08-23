"use client";

import { AscDesc } from "stream-chat";
import { ChannelList } from "stream-chat-react";

import { useSession } from "@core/app-provider";

export const StreamChatChannelList = () => {
  const { user } = useSession();

  // https://getstream.io/chat/docs/sdk/react/components/core-components/channel_list/#basic-usage
  const channelProps = {
    filters: {
      type: "messaging",
      members: { $in: [user.id] },
    },
    options: {
      state: true,
      presence: true,
      limit: 8,
    },
    sort: {
      last_message_at: -1 as AscDesc,
    },
  };

  return (
    <ChannelList
      filters={channelProps.filters}
      options={channelProps.options}
      sort={channelProps.sort}
    />
  );
};
