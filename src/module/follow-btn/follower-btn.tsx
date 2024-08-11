"use client";

import { FollowerInfo } from "@app/api/posts/post.prisma";
import { useFollowMutate } from "@app/api/users/[userId]/followers/use-follow.mutate";
import { useFollowerInfo } from "@app/api/users/[userId]/followers/use-follower-info";

import { Button } from "@core/app-shadcn/button";

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
