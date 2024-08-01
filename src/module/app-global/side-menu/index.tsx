import Link from "next/link";

import { cn } from "@core/utils";

import { Button } from "@module/app-shadcn/button";

import { SideMenuItem } from "./side-menu-item";

interface SideMenuProps {
  className?: string;
}

export function SideMenu({ className }: SideMenuProps) {
  // khoảng cách top 5.25 rem tính toán tay hard-code - hơi tệ
  // h-fit kết hợp với position sticky
  // flex-none ? - flex 0 0 auto
  // space-y-3 ?

  return (
    <div
      className={cn(
        "sticky top-[5.25rem] h-fit flex-none space-y-3 rounded-2xl bg-card px-3 py-5 shadow-sm lg:px-5 xl:w-80",
        className,
      )}
    >
      {SideMenuItem.map(item => (
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
      ))}
    </div>
  );
}
