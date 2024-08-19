import { NextRequest } from "next/server";

import {
  DEFAULT_PAGE_LIMIT,
  INTERNAL_ERROR,
  UNAUTHORIZED_ERROR,
} from "@app/api/_core/api.common";
import { validateRequest } from "@app/api/_core/lucia-auth";
import prisma from "@app/api/_core/prisma";
import { CommentsPage } from "@app/api/posts/[postId]/comment/comment.dto";
import { getCommentDataInclude } from "@app/api/posts/[postId]/comment/comment.query";

interface GetCommentParams {
  params: { postId: string };
}

// set api riêng, khi user click vào comment mới bắt đầu gọi
export async function GET(
  req: NextRequest,
  { params: { postId } }: GetCommentParams,
) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize =
      Number(req.nextUrl.searchParams.get("limit")) || DEFAULT_PAGE_LIMIT;
    const { user } = await validateRequest();
    if (!user) {
      return UNAUTHORIZED_ERROR;
    }
    // Vì fetch lastest comment và load dần ngược lại nên cursor lùi
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: getCommentDataInclude(user.id),
      orderBy: { createdAt: "asc" },
      take: -pageSize - 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    // Vì đi lùi nên cursor sẽ là ele đầu tiên
    // > ở đây thực chất là > 1 đơn vị,
    // vì logic pagination đang lấy dư 1 ele
    const previousCursor = comments.length > pageSize ? comments[0].id : null;

    const data: CommentsPage = {
      comments: comments.length > pageSize ? comments.slice(1) : comments,
      previousCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return INTERNAL_ERROR;
  }
}