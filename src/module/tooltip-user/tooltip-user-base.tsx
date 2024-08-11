import { PropsWithChildren } from "react";

import { UserData } from "@app/api/users/user.query";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@core/app-shadcn/tooltip";

import { TooltipUserContent } from "./tooltip-user-content";

interface TooltipUserProps extends PropsWithChildren {
  user: UserData;
}

// https://ui.shadcn.com/docs/components/tooltip
export function TooltipUserBase({ children, user }: TooltipUserProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <TooltipUserContent user={user} />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
