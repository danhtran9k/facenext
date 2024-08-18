"use server";
// Bắc buộc phải có use server ở đầu file để Next biết là server action

import { validateRequest } from "@app/api/_core/lucia-auth";
import prisma from "@app/api/_core/prisma";
import { createCommentSchema } from "@app/api/posts/[postId]/comment/comment.dto";
import { getCommentDataInclude } from "@app/api/posts/[postId]/comment/comment.query";
import { PostWithUser } from "@app/api/posts/post.prisma";

export async function submitComment({
  post,
  content,
}: {
  post: PostWithUser;
  content: string;
}) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const { content: contentValidated } = createCommentSchema.parse({ content });

  const newComment = await prisma.comment.create({
    data: {
      content: contentValidated,
      postId: post.id,
      userId: user.id,
    },
    include: getCommentDataInclude(user.id),
  });

  return newComment;
}

export type TSubmitComment = Awaited<ReturnType<typeof submitComment>>;
