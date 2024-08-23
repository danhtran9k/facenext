import { PostCursor } from "@app/api/posts/post.prisma";

import { MS_SECOND } from "@core/app.const";

export const INTERNAL_ERROR = Response.json(
  { error: "Internal server error" },
  { status: 500 },
);

export const UNAUTHORIZED_ERROR = Response.json(
  { error: "Unauthorized" },
  { status: 401 },
);

export const resourceNotFound = (res: string) =>
  Response.json({ error: `${res} not found` }, { status: 404 });

export const DEFAULT_PAGE_LIMIT = 4;

export type TFetchFeed = { pageParam: PostCursor };

export const IS_POOLING = false;
export const POOLING_INTERVAL = 4 * MS_SECOND;
