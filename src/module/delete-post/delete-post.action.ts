"use server";

import { validateRequest } from "@core/lucia-auth";
import prisma from "@core/prisma";
import { postDataInclude } from "@core/prisma/post.prisma";

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
    include: postDataInclude,
  });

  return deletedPost;
}
