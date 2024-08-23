"use client";

import { useChatSidebar } from "@core/app-vendor/stream-chat/chat-sidebar-provider";
import { StreamChatChannelList } from "@core/app-vendor/stream-chat/stream-chat-sidebar/stream-chat-channel-list";
import { cn } from "@core/utils";

export function StreamChatSidebar() {
  const { isSidebarOpen } = useChatSidebar();

  return (
    <div
      className={cn(
        "size-full flex-col border-e md:flex md:w-72",
        isSidebarOpen ? "flex" : "hidden",
      )}
    >
      <StreamChatChannelList />
    </div>
  );
}
