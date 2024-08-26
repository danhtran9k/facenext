import { NextRequest } from "next/server";

import { INTERNAL_ERROR, UNAUTHORIZED_ERROR } from "@app/api/_core/api.common";
import { validateRequest } from "@app/api/_core/lucia-auth";
import { getPaginateSearchParams } from "@app/api/_core/pagination.helper";
import prisma from "@app/api/_core/prisma";
import { PostsPage } from "@app/api/posts/post.prisma";
import { postDataInclude } from "@app/api/posts/post.query";

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return UNAUTHORIZED_ERROR;
    }

    const { getDataAndCursor, paginateQuery, SORT_ORDER } =
      getPaginateSearchParams(req.nextUrl.searchParams);

    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: user.id,
      },
      include: {
        post: {
          // chỗ này lại include bookmark ngược ko hay
          // Tuy nhiên vì feed data lại vào post-item nên vẫn cần
          include: postDataInclude(user.id),
        },
      },
      orderBy: {
        createdAt: SORT_ORDER,
      },
      ...paginateQuery,
    });

    const { cursor: nextCursor, dataPaginate } = getDataAndCursor(bookmarks);
    const data: PostsPage = {
      posts: dataPaginate.map(bookmark => bookmark.post),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return INTERNAL_ERROR;
  }
}
