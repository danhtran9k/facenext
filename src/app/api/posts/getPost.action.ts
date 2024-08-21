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

// vì post id là unique và được đánh Index nên ko dùng findFirst
export const privateGetPostById = async (postId: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      userId: true,
    },
  });

  // mục tiêu trả về author của post nếu post exist
  return post;
};
