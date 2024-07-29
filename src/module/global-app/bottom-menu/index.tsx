import Link from "next/link";

import { cn } from "@core/utils";

import { Button } from "@module/atom-shadcn/button";

import { BottomMenuItem } from "./bottom-menu-item";

interface BottomMenuProps {
  className?: string;
}

export function BottomMenu({ className }: BottomMenuProps) {
  return (
    <div
      className={cn(
        "sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3",
        className,
      )}
    >
      {BottomMenuItem.map(item => (
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
