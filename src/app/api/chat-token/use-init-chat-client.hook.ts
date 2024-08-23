import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";

import kyInstance from "@app/api/_core/ky";
import { keysStreamChat } from "@app/api/_core/queryKey";

import { useSession } from "@core/app-provider";

type TChatTokenResponse = {
  token: string;
};

const getChatToken = () =>
  kyInstance
    .get(keysStreamChat.api)
    .json<TChatTokenResponse>()
    .then(data => data.token);

export default function useInitializeChatClient() {
  const { user } = useSession();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);

  // Cách basic dùng thẳng hook của thư viện cung cấp, ko manual call
  // https://getstream.io/chat/docs/react/?language=javascript#clients-and-users
  // https://getstream.io/chat/react-chat/tutorial/#create-a-livestream-style-chat-app
  // https://getstream.io/chat/docs/sdk/react/basics/getting_started/#chat-client--connecting-user

  // https://getstream.io/chat/docs/sdk/react/guides/client-and-user/#connecting-and-disconnecting-a-user
  // https://getstream.io/chat/docs/react/tokens_and_authentication/?language=javascript
  // -> Link cuối sẽ return về promise, bắt buộc phải đẩy vào useEffect
  // Docs và ex ko chi tiết
  useEffect(() => {
    const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_KEY!);
    const streamChatUser = {
      id: user.id,
      username: user.username,
      name: user.displayName,
      image: user.avatarUrl,
    };

    client
      .connectUser(streamChatUser, getChatToken)
      .catch(error => console.error("Failed to connect user", error))
      .then(() => setChatClient(client));

    return () => {
      setChatClient(null);
      client
        .disconnectUser()
        .catch(error => console.error("Failed to disconnect user", error))
        .then(() => console.log("Connection closed"));
    };
    // Trick manual check in useEffect
  }, [user.id, user.username, user.displayName, user.avatarUrl]);

  return chatClient;
}
