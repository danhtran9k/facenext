import { Metadata } from "next";

import Chat from "@core/app-vendor/stream-chat/Chat";

export const metadata: Metadata = {
  title: "Messages",
};

export default function Page() {
  return <Chat />;
}
