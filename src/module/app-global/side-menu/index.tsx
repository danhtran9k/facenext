import Link from "next/link";

import { Button } from "@core/app-shadcn/button";
import { PATH_URL } from "@core/path.const";
import { cn } from "@core/utils";

import { streamServerClient } from "@app/api/_core/getStream-instance";
import { validateRequest } from "@app/api/_core/lucia-auth";
import prisma from "@app/api/_core/prisma";

import { MessagesButton } from "./message-btn";
import { NotificationsButton } from "./notification-btn";
import { SideMenuItem } from "./side-menu-item";

interface SideMenuProps {
  className?: string;
}

export async function SideMenu({ className }: SideMenuProps) {
  // khoảng cách top 5.25 rem tính toán tay hard-code - hơi tệ
  // h-fit kết hợp với position sticky
  // flex-none ? - flex 0 0 auto
  // space-y-3 ?

  // TODO: xứ lý gọi async ở cấp Menu lớn, tuỳ trade off
  const { user } = await validateRequest();

  if (!user) return null;

  const [unreadNotificationCount, unreadMessageCount] = await Promise.all([
    prisma.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    }),
    (await streamServerClient.getUnreadCount(user.id)).total_unread_count,
  ]);

  return (
    <div
      className={cn(
        "sticky top-[5.25rem] h-fit flex-none space-y-3 rounded-2xl bg-card px-3 py-5 shadow-sm lg:px-5 xl:w-80",
        className,
      )}
    >
      {SideMenuItem.map(item => {
        // Vì generalize quá sớm nên xuất hiện edge case riêng
        // Code tạm xử lý
        // TODO: check lại thử

        if (item.href === PATH_URL.NOTIFICATIONS) {
          return (
            <NotificationsButton
              key={item.href}
              initialState={{ unreadCount: unreadNotificationCount }}
            />
          );
        }

        if (item.href === PATH_URL.MESSAGES) {
          return (
            <MessagesButton
              key={item.href}
              initialState={{ unreadCount: unreadMessageCount }}
            />
          );
        }

        return (
          <Button
            key={item.href}
            variant="ghost"
            className="flex items-center justify-start gap-3"
            title={item.title}
            asChild
          >
            <Link href={item.href}>
              {item.icon}
              <span className="hidden lg:inline">{item.title}</span>
            </Link>
          </Button>
        );
      })}
    </div>
  );
}
