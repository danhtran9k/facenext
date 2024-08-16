import { PostCursor } from "@app/api/posts/post.prisma";

export const INTERNAL_ERROR = Response.json(
  { error: "Internal server error" },
  { status: 500 },
);

export const UNAUTHORIZED_ERROR = Response.json(
  { error: "Unauthorized" },
  { status: 401 },
);

export const DEFAULT_PAGE_LIMIT = 10;

export type TFetchFeed = { pageParam: PostCursor };
