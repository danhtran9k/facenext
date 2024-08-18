"use client";

import { MessageSquare } from "lucide-react";

import { PostWithUser } from "@app/api/posts/post.prisma";

interface CommentButtonProps {
  post: PostWithUser;
  onClick: () => void;
}

// vì onClick setState show của comment nên là Client component
export function PostCommentShowBtn({ post, onClick }: CommentButtonProps) {
  return (
    <button onClick={onClick} className="flex items-center gap-2">
      <MessageSquare className="size-5" />
      <span className="text-sm font-medium tabular-nums">
        {post._count.comments}{" "}
        <span className="hidden sm:inline">comments</span>
      </span>
    </button>
  );
}
