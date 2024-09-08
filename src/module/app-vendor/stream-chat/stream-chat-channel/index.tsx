"use client";

import { Channel, MessageInput, MessageList, Window } from "stream-chat-react";

import { cn } from "@core/utils";

import { useChatSidebar } from "@module/app-vendor/stream-chat";

import { StreamChatChannelHeader } from "./stream-chat-channel-header";

export function StreamChatChannel() {
  const { isSidebarOpen } = useChatSidebar();

  // https://getstream.io/chat/docs/sdk/react/components/utility-components/window/
  // https://getstream.io/chat/docs/sdk/react/basics/getting_started/#your-first-app-with-stream-chat-react
  // Vì có sử dụng ChannelList nên Channel ko cần truyền thêm
  return (
    <div className={cn("w-full md:block", isSidebarOpen && "hidden")}>
      <Channel>
        <Window>
          <StreamChatChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </div>
  );
}
