"use client";

import { Loader2 } from "lucide-react";

import useInitializeChatClient from "@app/api/chat-token/use-init-chat-client.hook";

export default function Chat() {
  const chatClient = useInitializeChatClient();

  if (!chatClient) {
    return <Loader2 className="mx-auto my-3 animate-spin" />;
  }

  return (
    <main>
      <div>Chat</div>
    </main>
  );
}
