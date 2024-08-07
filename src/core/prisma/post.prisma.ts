import { Prisma } from "@prisma/client";

import { postDataInclude } from "./post.query";

// dùng satisfies để kiểm tra xem có phải là PostInclude không
// keyword satisfis bản chất khác với as là dạng ép kiểu

// https://www.prisma.io/docs/orm/prisma-client/type-safety/operating-against-partial-structures-of-model-types#problem-using-variations-of-the-generated-model-type
export type PostWithUser = Prisma.PostGetPayload<{
  include: ReturnType<typeof postDataInclude>;
}>;

export type PostCursor = string | null;

export interface PostsPage {
  posts: PostWithUser[];
  nextCursor: PostCursor;
}

export interface FollowerInfo {
  followers: number;
  isFollowedByUser: boolean;
}

export interface UserIdParam {
  params: {
    userId: string;
  };
}
