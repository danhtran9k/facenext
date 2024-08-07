"use client";

import { formatNumber } from "@core/helper/number.utils";
import { FollowerInfo } from "@core/prisma/post.prisma";

import { useFollowerInfo } from "@module/follow-btn/";

interface FollowerCountProps {
  userId: string;
  initialState: FollowerInfo;
}

// component này use-client vì muốn khi thao tác bấm follow ở 1 ui khác thì có thể invalidate data này để update number
export function FollowerCount({ userId, initialState }: FollowerCountProps) {
  const { data } = useFollowerInfo(userId, initialState);

  return (
    <span>
      Followers:{" "}
      <span className="font-semibold">{formatNumber(data.followers)}</span>
    </span>
  );
}
