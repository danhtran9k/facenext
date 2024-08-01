import { Prisma } from "@prisma/client";

export const postDataInclude = {
  user: {
    select: {
      username: true,
      displayName: true,
      avatarUrl: true,
    },
  },
} satisfies Prisma.PostInclude;
// dùng satisfies để kiểm tra xem có phải là PostInclude không
// keyword satisfis bản chất khác với as là dạng ép kiểu

// https://www.prisma.io/docs/orm/prisma-client/type-safety/operating-against-partial-structures-of-model-types#problem-using-variations-of-the-generated-model-type
export type PostWithUser = Prisma.PostGetPayload<{
  include: typeof postDataInclude;
}>;
