import { NextRequest } from "next/server";

import { validateRequest } from "@core/lucia-auth";
import prisma from "@core/prisma";
import { PostsPage } from "@core/prisma/post.prisma";
import { postDataInclude } from "@core/prisma/post.query";

const DEFAULT_LIMIT = 10;
export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // https://nextjs.org/docs/app/api-reference/functions/next-request#nexturl
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize =
      Number(req.nextUrl.searchParams.get("limit")) || DEFAULT_LIMIT;

    // n+1 problem ??
    const posts = await prisma.post.findMany({
      include: postDataInclude(user.id),
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      // skip: cursor ? 1 : 0,
      // ko dùng skip vì take đã lấy dư 1, tự search thêm
      cursor: cursor ? { id: cursor } : undefined,
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
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
