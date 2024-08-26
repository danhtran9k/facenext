"use client";

import { ChannelList } from "stream-chat-react";

import { useChannelListOption } from "@app/api/chat/use-channel-list-option.hook";

import { StreamChatPreviewMess } from "./stream-chat-channel-preview";

export const StreamChatChannelList = () => {
  const { additionalChannelSearchProps, channelProps } = useChannelListOption();

  return (
    <ChannelList
      showChannelSearch
      filters={channelProps.filters}
      options={channelProps.options}
      sort={channelProps.sort}
      additionalChannelSearchProps={additionalChannelSearchProps}
      // Preview={(props) => <StreamChatPreviewMess {...props} />}
      Preview={StreamChatPreviewMess}
    />
  );
};
