import { notFound } from "next/navigation";
import { cache } from "react";

import prisma from "@app/api/_core/prisma";

import { postDataInclude } from "./post.query";

export const getPost = cache(async (postId: string, loggedInUserId: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: postDataInclude(loggedInUserId),
  });

  if (!post) notFound();

  return post;
});
