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

    const { SORT_ORDER, paginateQuery, getDataAndCursor, searchQuery } =
      getPaginateSearchParams(req.nextUrl.searchParams);

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            content: {
              search: searchQuery,
            },
          },
          {
            user: {
              displayName: {
                search: searchQuery,
              },
            },
          },
          {
            user: {
              username: {
                search: searchQuery,
              },
            },
          },
        ],
      },
      include: postDataInclude(user.id),
      orderBy: { createdAt: SORT_ORDER },
      ...paginateQuery,
    });

    const { cursor: nextCursor, dataPaginate } = getDataAndCursor(posts);
    const data: PostsPage = {
      posts: dataPaginate,
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return INTERNAL_ERROR;
  }
}
