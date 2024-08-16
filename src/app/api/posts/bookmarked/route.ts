import { NextRequest } from "next/server";

import { INTERNAL_ERROR, UNAUTHORIZED_ERROR } from "@app/api/_core/api.common";
import { validateRequest } from "@app/api/_core/lucia-auth";
import prisma from "@app/api/_core/prisma";
import { PostsPage } from "@app/api/posts/post.prisma";
import { postDataInclude } from "@app/api/posts/post.query";

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = Number(req.nextUrl.searchParams.get("limit")) || 10;

    const { user } = await validateRequest();

    if (!user) {
      return UNAUTHORIZED_ERROR;
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: user.id,
      },
      include: {
        post: {
          // chỗ này lại include bookmark ngược ko hay
          include: postDataInclude(user.id),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor =
      bookmarks.length > pageSize ? bookmarks[pageSize].id : null;

    const data: PostsPage = {
      posts: bookmarks.slice(0, pageSize).map(bookmark => bookmark.post),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return INTERNAL_ERROR;
  }
}
