import { Prisma } from "@prisma/client";

// type này đúng ra phải use-server-only
// client ko được phép truy cập

export const userDataSelect = {
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
} satisfies Prisma.UserSelect;

export const postDataInclude = {
  user: {
    select: userDataSelect,
  },
} satisfies Prisma.PostInclude;
// dùng satisfies để kiểm tra xem có phải là PostInclude không
// keyword satisfis bản chất khác với as là dạng ép kiểu

// https://www.prisma.io/docs/orm/prisma-client/type-safety/operating-against-partial-structures-of-model-types#problem-using-variations-of-the-generated-model-type
export type PostWithUser = Prisma.PostGetPayload<{
  include: typeof postDataInclude;
}>;

export interface PostsPage {
  posts: PostWithUser[];
  nextCursor: string | null;
}
