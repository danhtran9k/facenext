"use client";

import { Loader2, SendHorizonal } from "lucide-react";
import { useState } from "react";

import { useCreatePostComment } from "@app/api/posts/[postId]/comment/use-create-comment.hook";
import { PostWithUser } from "@app/api/posts/post.prisma";

import { Button } from "@core/app-shadcn/button";
import { Input } from "@core/app-shadcn/input";

interface CommentInputProps {
  post: PostWithUser;
}

export function PostCommentInput({ post }: CommentInputProps) {
  const [input, setInput] = useState("");

  const { mutate, isPending } = useCreatePostComment(post.id);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!input) return;

    mutate(
      {
        post,
        content: input,
      },
      {
        onSuccess: () => setInput(""),
      },
    );
  }

  return (
    <form className="flex w-full items-center gap-2" onSubmit={onSubmit}>
      <Input
        placeholder="Write a comment..."
        value={input}
        onChange={e => setInput(e.target.value)}
        autoFocus
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        disabled={!input.trim() || isPending}
      >
        {!isPending ? <SendHorizonal /> : <Loader2 className="animate-spin" />}
      </Button>
    </form>
  );
}
