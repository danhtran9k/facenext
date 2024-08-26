// server only

import { StreamChat } from "stream-chat";

// https://getstream.io/chat/docs/node/?language=javascript
export const streamServerClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_KEY!,
  process.env.STREAM_SECRET,
);
