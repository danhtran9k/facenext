"use server";

import { validateRequest } from "@app/api/_core/lucia-auth";
import prisma from "@app/api/_core/prisma";
import { postDataInclude } from "@app/api/posts/post.query";

import { createPostSchema, TCreatePost } from "./create-post.dto";

export async function submitPost(input: TCreatePost) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const { content, mediaIds } = createPostSchema.parse(input);

  const newPost = await prisma.post.create({
    data: {
      content,
      userId: user.id,
      // https://www.prisma.io/docs/orm/reference/prisma-client-reference#connect
      // Chỗ này chú ý vì khi upload img lên là lưu bản tạm liền
      // nên logic connect sẽ ko phải async mà db đã có sẵn media
      attachments: {
        connect: mediaIds.map(id => ({ id })),
      },
    },
    include: postDataInclude(user.id),
  });
  // ko thể gọi revalidatePath("") vì action này gọi trong client component !!
  // -> dùng react query

  return newPost;
}
