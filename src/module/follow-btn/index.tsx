"use client";

import { FollowerInfo } from "@core/prisma/post.prisma";

import { Button } from "@module/app-shadcn/button";

import { useFollowMutate } from "./use-follow.mutate";
import useFollowerInfo from "./use-follower-info";

interface FollowButtonProps {
  userId: string;
  initialState: FollowerInfo;
}

export function FollowButton({ userId, initialState }: FollowButtonProps) {
  const { data } = useFollowerInfo(userId, initialState);
  const { mutate } = useFollowMutate(data.isFollowedByUser, userId);

  return (
    <Button
      variant={data.isFollowedByUser ? "secondary" : "default"}
      onClick={() => mutate()}
    >
      {data.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
}
