import { Prisma } from "@prisma/client";
import { InfiniteData } from "@tanstack/react-query";
import { z } from "zod";

import { getCommentDataInclude } from "@app/api/posts/[postId]/comment/comment.query";

import { requiredString } from "@core/types/common.schema";

export type CommentData = Prisma.CommentGetPayload<{
  include: ReturnType<typeof getCommentDataInclude>;
}>;

export type CommentCursor = string | null;

export interface CommentsPage {
  comments: CommentData[];
  previousCursor: CommentCursor;
}

export const createCommentSchema = z.object({
  content: requiredString,
});

export type InfinityComment = InfiniteData<CommentsPage, CommentCursor>;
