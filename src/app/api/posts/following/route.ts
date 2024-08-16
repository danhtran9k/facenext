import { NextRequest } from "next/server";

import {
  DEFAULT_PAGE_LIMIT,
  INTERNAL_ERROR,
  UNAUTHORIZED_ERROR,
} from "@app/api/_core/api.common";
import { validateRequest } from "@app/api/_core/lucia-auth";
import prisma from "@app/api/_core/prisma";
import { PostsPage } from "@app/api/posts/post.prisma";
import { postDataInclude } from "@app/api/posts/post.query";

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return UNAUTHORIZED_ERROR;
    }

    // https://nextjs.org/docs/app/api-reference/functions/next-request#nexturl
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize =
      Number(req.nextUrl.searchParams.get("limit")) || DEFAULT_PAGE_LIMIT;

    // n+1 problem ??
    const posts = await prisma.post.findMany({
      where: {
        user: {
          followers: {
            some: {
              followerId: user.id,
            },
          },
        },
      },
      cursor: cursor ? { id: cursor } : undefined,
      take: pageSize + 1,
      // skip: cursor ? 1 : 0,
      // ko dùng skip vì take đã lấy dư 1, tự search thêm
      include: postDataInclude(user.id),
      orderBy: { createdAt: "desc" },
    });

    // vì lấy dư + 1 nên phải slice và tính toán nextCursor lại
    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

    const data: PostsPage = {
      posts: posts.slice(0, pageSize),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return INTERNAL_ERROR;
  }
}
