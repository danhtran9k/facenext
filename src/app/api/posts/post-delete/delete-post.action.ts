"use server";

import { validateRequest } from "@app/api/_core/lucia-auth";
import prisma from "@app/api/_core/prisma";

import { postDataInclude } from "@app/api/posts/post.query";

export async function deletePost(id: string) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  //
  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) throw new Error("Post not found");

  // Cannot delete others people's posts
  if (post.userId !== user.id) throw new Error("Unauthorized");

  const deletedPost = await prisma.post.delete({
    where: { id },
    include: postDataInclude(user.id),
  });

  return deletedPost;
}
