import Link from "next/link";
import { PropsWithChildren } from "react";

import { PATH_URL } from "@core/path.const";

import { UserData } from "@app/api/users/user.query";

import { TooltipUserBase } from "./tooltip-user-base";

// Lí do ko nên tạo file props chung cho nhiều component
// vd TH này chỉ là 1 case đặc biệt kèm Link để DRY
// Tuy nhiên so với TooltipUser gốc thì cần truyền thêm css của Link để custom
interface TooltipUserProps extends PropsWithChildren {
  user: UserData;
  className?: string;
}

export function TooltipUser({ children, user, className }: TooltipUserProps) {
  return (
    <TooltipUserBase user={user}>
      <Link href={PATH_URL.userProfile(user.username)} className={className}>
        {children}
      </Link>
    </TooltipUserBase>
  );
}
