"use client";

import {
  ChannelPreviewMessenger,
  ChannelPreviewUIComponentProps,
} from "stream-chat-react";

import { useChatSidebar } from "@core/app-vendor/stream-chat/chat-sidebar-provider";

type TStreamChatPreviewMess = ChannelPreviewUIComponentProps;

// https://getstream.io/chat/docs/sdk/react/components/utility-components/channel_preview_ui/
// Override với việc thêm props onSelect vào default component
// Mục đích là khi size md trở xuống, nếu sidebar show thì show toàn view
// nếu click vào channel thì close sidebar
export const StreamChatPreviewMess = (props: TStreamChatPreviewMess) => {
  const { setSidebarClose } = useChatSidebar();

  const handleSelect = () => {
    props.setActiveChannel?.(props.channel, props.watchers);
    setSidebarClose();
  };

  return <ChannelPreviewMessenger {...props} onSelect={handleSelect} />;
};
