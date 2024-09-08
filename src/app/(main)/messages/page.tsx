import { Metadata } from "next";

import { StreamChat } from "@module/app-vendor/stream-chat";

export const metadata: Metadata = {
  title: "Messages",
};

export default function Page() {
  return <StreamChat />;
}
