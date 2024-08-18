"use client";

import { Loader2 } from "lucide-react";

import { usePostCommentInfinity } from "@app/api/posts/[postId]/comment/use-comment-infinity.hook";
import { PostWithUser } from "@app/api/posts/post.prisma";

import { Button } from "@core/app-shadcn/button";

import { PostCommentItem } from "./post-comment-item";

interface PostCommentInfinityProps {
  post: PostWithUser;
}

export const PostCommentInfinity = ({ post }: PostCommentInfinityProps) => {
  const {
    data: comments,
    fetchNextPage,
    hasNextPage,
    isFetching,
    status,
  } = usePostCommentInfinity(
    post.id,
    data => data?.pages.flatMap(page => page.comments) || [],
  );

  return (
    <>
      {hasNextPage && (
        <Button
          variant="link"
          className="mx-auto block"
          disabled={isFetching}
          onClick={() => fetchNextPage()}
        >
          Load previous comments
        </Button>
      )}
      {status === "pending" && <Loader2 className="mx-auto animate-spin" />}
      {status === "success" && !comments.length && (
        <p className="text-center text-muted-foreground">No comments yet.</p>
      )}
      {status === "error" && (
        <p className="text-center text-destructive">
          An error occurred while loading comments.
        </p>
      )}
      <div className="divide-y">
        {comments?.map(comment => (
          <PostCommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </>
  );
};
