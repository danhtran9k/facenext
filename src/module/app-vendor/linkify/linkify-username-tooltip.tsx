"use client";

import Link from "next/link";
import { PropsWithChildren } from "react";

import { PATH_URL } from "@core/path.const";

import { useUserByNameOrId } from "@app/api/users/[userId]/use-user-by-name-or-id.query";

import { TooltipUser } from "@module/app-common/tooltip-user";

interface LinkifyUsernameTooltipProps extends PropsWithChildren {
  username: string;
  hasNestedTooltip?: boolean;
}

// Vì tooltip này sinh ra do Linkify nội suy nên chỉ biết được userName
// ko truyền props user được
// Viết thành server component vẫn ok nhưng performance kém vì mất thời gian query trước khi có HTML
// dạng client khi này sẽ có html tiết kiệm query trước rồi gọi sau
export function LinkifyUsernameTooltip({
  children,
  username,
  hasNestedTooltip = true,
}: LinkifyUsernameTooltipProps) {
  const { data } = useUserByNameOrId(username, hasNestedTooltip);

  // Phải setup DK dừng vì lý thuyết có thể bị recursive
  if (!data || !hasNestedTooltip) {
    // Tuy ko có data những vẫn setup url dummy
    // Cẩn thận mis-match giữa 2 link
    return (
      <Link
        href={PATH_URL.userProfile(username)}
        className="text-primary hover:underline"
      >
        {children}
      </Link>
    );
  }

  // Tooltip User content lại gọi Linkify
  // nhưng khi gọi sẽ kèm hasNestedTooltip = false tránh recursive
  return (
    <TooltipUser user={data} className="text-primary hover:underline">
      {children}
    </TooltipUser>
  );
}
