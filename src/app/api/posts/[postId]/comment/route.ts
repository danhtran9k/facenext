import { NextRequest } from "next/server";

import { INTERNAL_ERROR, UNAUTHORIZED_ERROR } from "@app/api/_core/api.common";
import { validateRequest } from "@app/api/_core/lucia-auth";
import { getPaginateSearchParams } from "@app/api/_core/pagination.helper";
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
    const { user } = await validateRequest();
    if (!user) {
      return UNAUTHORIZED_ERROR;
    }

    const { getDataAndCursor, paginateQuery, SORT_ORDER } =
      getPaginateSearchParams(req.nextUrl.searchParams, false);

    // Vì fetch latest comment và load dần ngược lại nên cursor lùi
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: getCommentDataInclude(user.id),
      orderBy: { createdAt: SORT_ORDER },
      ...paginateQuery,
    });

    const { cursor: previousCursor, dataPaginate } = getDataAndCursor(comments);
    const data: CommentsPage = {
      comments: dataPaginate,
      previousCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return INTERNAL_ERROR;
  }
}
