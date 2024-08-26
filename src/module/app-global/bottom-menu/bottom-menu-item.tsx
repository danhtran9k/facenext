import { Bell, Bookmark, Home, Mail } from "lucide-react";

import { PATH_URL } from "@core/path.const";

export const BottomMenuItem = [
  {
    title: "Home",
    href: PATH_URL.ROOT,
    icon: <Home />,
  },
  {
    title: "Notifications",
    href: PATH_URL.NOTIFICATIONS,
    icon: <Bell />,
  },
  {
    title: "Messages",
    href: PATH_URL.MESSAGES,
    icon: <Mail />,
  },
  {
    title: "Bookmarks",
    href: PATH_URL.BOOKMARK,
    icon: <Bookmark />,
  },
];
