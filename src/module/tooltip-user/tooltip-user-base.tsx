import { PropsWithChildren } from "react";

import { UserData } from "@core/prisma/user.query";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@module/app-shadcn/tooltip";

interface TooltipUserProps extends PropsWithChildren {
  user: UserData;
}

// https://ui.shadcn.com/docs/components/tooltip
export function TooltipUserBase({ children }: TooltipUserProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>Hover</TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
