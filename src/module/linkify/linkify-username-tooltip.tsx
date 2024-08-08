"use client";

import Link from "next/link";
import { PropsWithChildren } from "react";

import { useUserByNameOrId } from "@app/api/users/[userId]/use-user-by-name-or-id.query";

import { TooltipUser } from "@module/tooltip-user";

interface LinkifyUsernameTooltipProps extends PropsWithChildren {
  username: string;
}

// Vì tooltip này sinh ra do Linkify nội suy nên chỉ biết được userName
// ko truyền props user được
// Viết thành server component vẫn ok nhưng performance kém vì mất thời gian query trước khi có HTML
// dạng client khi này sẽ có html tiết kiệm query trước rồi gọi sau
export function LinkifyUsernameTooltip({
  children,
  username,
}: LinkifyUsernameTooltipProps) {
  const { data } = useUserByNameOrId(username);
  console.log("🚀 ~ data:", data);

  if (!data) {
    // Tuy ko có data những vẫn setup url dummy
    // Cẩn thận mis-match giữa 2 link
    return (
      <Link
        href={`/users/${username}`}
        className="text-primary hover:underline"
      >
        {children}
      </Link>
    );
  }

  return (
    <TooltipUser user={data} className="text-primary hover:underline">
      {children}
    </TooltipUser>
  );
}
