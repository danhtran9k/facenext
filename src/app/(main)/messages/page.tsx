import { Metadata } from "next";

import { StreamChat } from "@core/app-vendor/stream-chat/stream-chat";

export const metadata: Metadata = {
  title: "Messages",
};

export default function Page() {
  return <StreamChat />;
}
