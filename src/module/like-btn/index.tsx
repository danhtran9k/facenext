"use client";

import { Heart } from "lucide-react";

import { useLikePost } from "@app/api/posts/[postId]/likes/use-like-post.mutate";
import { useLikePostQuery } from "@app/api/posts/[postId]/likes/use-like-post.query";
import { LikeInfo } from "@app/api/posts/post.prisma";

import { cn } from "@core/utils";

interface LikeButtonProps {
  postId: string;
  initialState: LikeInfo;
}

export function LikeButton({ postId, initialState }: LikeButtonProps) {
  const { data } = useLikePostQuery(postId, initialState);
  const { mutate } = useLikePost(postId, data.isLikedByUser);

  return (
    <button onClick={() => mutate()} className="flex items-center gap-2">
      <Heart
        className={cn(
          "size-5",
          data.isLikedByUser && "fill-red-500 text-red-500",
        )}
      />
      <span className="text-sm font-medium tabular-nums">
        {data.likes} <span className="hidden sm:inline">likes</span>
      </span>
    </button>
  );
}
