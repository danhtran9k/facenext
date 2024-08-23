"use client";

import { Menu } from "lucide-react";
import { ChannelHeader, ChannelHeaderProps } from "stream-chat-react";

import { Button } from "@core/app-shadcn/button";
import { useChatSidebar } from "@core/app-vendor/stream-chat/chat-sidebar-provider";

interface CustomChannelHeaderProps extends ChannelHeaderProps {}

export function StreamChatChannelHeader(props: CustomChannelHeaderProps) {
  const { setSidebarOpen } = useChatSidebar();

  return (
    <div className="flex items-center gap-3">
      <div className="h-full p-2 md:hidden">
        <Button size="icon" variant="ghost" onClick={setSidebarOpen}>
          <Menu className="size-5" />
        </Button>
      </div>
      <ChannelHeader {...props} />
    </div>
  );
}
