"use client";

import { Bookmark } from "lucide-react";

import { usePostIdBookmark } from "@app/api/posts/[postId]/bookmark/use-postId-bookmark";
import { usePostIdBookmarkMutate } from "@app/api/posts/[postId]/bookmark/use-postId-bookmark.mutate";
import { BookmarkInfo } from "@app/api/posts/post.prisma";

import { cn } from "@core/utils";

interface BookmarkButtonProps {
  postId: string;
  initialState: BookmarkInfo;
}

export function BookmarkButton({ postId, initialState }: BookmarkButtonProps) {
  const { data } = usePostIdBookmark(postId, initialState);
  const { mutate } = usePostIdBookmarkMutate(postId, data.isBookmarkedByUser);

  return (
    <button onClick={() => mutate()} className="flex items-center gap-2">
      <Bookmark
        className={cn(
          "size-5",
          data.isBookmarkedByUser && "fill-primary text-primary",
        )}
      />
    </button>
  );
}
