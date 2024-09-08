"use client";

import { Bookmark } from "lucide-react";

import { cn } from "@core/utils";

import { usePostIdBookmark } from "@app/api/posts/[postId]/bookmark/use-postId-bookmark";
import { usePostIdBookmarkMutate } from "@app/api/posts/[postId]/bookmark/use-postId-bookmark.mutate";
import { BookmarkInfo } from "@app/api/posts/post.prisma";

interface BookmarkButtonProps {
  postId: string;
  initialState: BookmarkInfo;
}

export function BookmarkButton({ postId, initialState }: BookmarkButtonProps) {
  // Tuy viết gọi query nhưng vì initialState + staleTime infinite
  // => thực chất ko gọi mà feed initialState vào trực tiếp
  // Tức là queryKey chỉ có tác dụng chia nhỏ Data để quán lý, chứ sẽ ko gọi
  // Ý tưởng này cũng áp dụng cho like
  // TUy nhiên trade-off là phải quản lý qua queryKey chuẩn xíu
  // lợi là ko phải invalidateData lớn mà bóc tác 1 cụm queryKey nhỏ để modified
  const { data } = usePostIdBookmark(postId, initialState);

  // Tuy nhiên vì bookmark có kèm infinityLoad nên muốn UX chuẩn chỉ rất khó
  // vd UI timeout khi đang trong trang, nhưng navigate vào thì setData trước
  // còn force push vào thì ko ổn vì pagination ko biết sẽ sort ntn, push sai có khả năng dup data
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
