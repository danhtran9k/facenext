import Link from "next/link";
import { PropsWithChildren } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@core/app-shadcn/tooltip";
import { PATH_URL } from "@core/path.const";

import { UserData } from "@app/api/users/user.query";

import { TooltipUserContent } from "./tooltip-user-content";

// Lí do ko nên tạo file props chung cho nhiều component
// vd TH này chỉ là 1 case đặc biệt kèm Link để DRY
// Tuy nhiên so với TooltipUser gốc thì cần truyền thêm css của Link để custom
interface TooltipUserProps extends PropsWithChildren {
  user: UserData;
  className?: string;
}

export function TooltipUser({ children, user, className }: TooltipUserProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={PATH_URL.userProfile(user.username)}
            className={className}
          >
            {children}
          </Link>
        </TooltipTrigger>

        <TooltipContent>
          <TooltipUserContent user={user} />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
