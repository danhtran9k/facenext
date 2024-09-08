"use client";

import { Loader2 } from "lucide-react";
import { Chat } from "stream-chat-react";

import useInitializeChatClient from "@app/api/chat/use-init-chat-client.hook";

import { ChatSidebarProvider } from "./chat-sidebar-provider";
import { StreamChatChannel } from "./stream-chat-channel";
import { StreamChatSidebar } from "./stream-chat-sidebar";
import { useStreamChatThemeClassName } from "./use-streamChat-theme.hook";

export function StreamChat() {
  const chatClient = useInitializeChatClient();
  const themeClassName = useStreamChatThemeClassName();

  if (!chatClient) {
    return <Loader2 className="mx-auto my-3 animate-spin" />;
  }

  // CSS Note: stretch full div to main view port
  // https://getstream.io/chat/docs/sdk/react/basics/getting_started/
  // https://getstream.io/chat/docs/sdk/react/components/core-components/chat/
  // Sidebar chứa channel list
  return (
    <main className="relative w-full overflow-hidden rounded-2xl bg-card shadow-sm">
      <div className="absolute bottom-0 top-0 flex w-full">
        <Chat client={chatClient} theme={themeClassName}>
          <ChatSidebarProvider>
            <StreamChatSidebar />
            <StreamChatChannel />
          </ChatSidebarProvider>
        </Chat>
      </div>
    </main>
  );
}
