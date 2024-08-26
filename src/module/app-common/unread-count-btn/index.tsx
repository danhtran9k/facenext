import Link from "next/link";

import { Button } from "@core/app-shadcn/button";

type TUnreadCountBtnProps = {
  count: number;
  link: string;
  title: string;
  icon: React.ReactNode;
};

export const UnreadCountBtn = ({
  count,
  link,
  title,
  icon,
}: TUnreadCountBtnProps) => {
  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-3"
      title={title}
      asChild
    >
      <Link href={link}>
        <div className="relative">
          {icon}
          {!!count && (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
              {count}
            </span>
          )}
        </div>
        <span className="hidden lg:inline">{title}</span>
      </Link>
    </Button>
  );
};
