"use client";

import { useChatSidebar } from "@core/app-vendor/stream-chat/chat-sidebar-provider";
import { cn } from "@core/utils";

import { StreamChatChannelList } from "./stream-chat-channel-list";
import { StreamChatMenuHeader } from "./stream-chat-menu-header";

export function StreamChatSidebar() {
  const { isSidebarOpen } = useChatSidebar();

  return (
    <div
      className={cn(
        "size-full flex-col border-e md:flex md:w-72",
        isSidebarOpen ? "flex" : "hidden",
      )}
    >
      <StreamChatMenuHeader />
      <StreamChatChannelList />
    </div>
  );
}
