"use server";

import { validateRequest } from "@app/api/_core/lucia-auth";
import prisma from "@app/api/_core/prisma";
import { getCommentDataInclude } from "@app/api/posts/[postId]/comment/comment.query";

export async function deleteComment(id: string) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) throw new Error("Comment not found");

  if (comment.userId !== user.id) throw new Error("Unauthorized");

  const deletedComment = await prisma.comment.delete({
    where: { id },
    include: getCommentDataInclude(user.id),
  });

  return deletedComment;
}

export type TDeleteComment = Awaited<ReturnType<typeof deleteComment>>;
