"use client";

import {
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Window,
} from "stream-chat-react";

import { useChatSidebar } from "@core/app-vendor/stream-chat/chat-sidebar-provider";
import { cn } from "@core/utils";

export function StreamChatChannel() {
  const { isSidebarOpen } = useChatSidebar();

  // https://getstream.io/chat/docs/sdk/react/components/utility-components/window/
  // https://getstream.io/chat/docs/sdk/react/basics/getting_started/#your-first-app-with-stream-chat-react
  // Vì có sử dụng ChannelList nên Channel ko cần truyền thêm
  return (
    <div className={cn("w-full md:block", isSidebarOpen && "hidden")}>
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </div>
  );
}
