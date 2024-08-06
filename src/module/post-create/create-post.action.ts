"use server";

import { validateRequest } from "@core/lucia-auth";
import prisma from "@core/prisma";
import { postDataInclude } from "@core/prisma/post.query";

import { createPostSchema } from "./create-post.dto";

export async function submitPost(input: string) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const { content } = createPostSchema.parse({ content: input });

  const newPost = await prisma.post.create({
    data: {
      content,
      userId: user.id,
    },
    include: postDataInclude(user.id),
  });
  // ko thể gọi revalidatePath("") vì action này gọi trong client component !!
  // -> dùng react query

  return newPost;
}
