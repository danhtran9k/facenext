import { NextRequest } from "next/server";

import { validateRequest } from "@app/api/_core/lucia-auth";
import prisma from "@app/api/_core/prisma";
import { PostsPage, UserIdParam } from "@app/api/posts/post.prisma";
import { postDataInclude } from "@app/api/posts/post.query";

const DEFAULT_LIMIT = 10;

export async function GET(
  req: NextRequest,
  { params: { userId } }: UserIdParam,
) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize =
      Number(req.nextUrl.searchParams.get("limit")) || DEFAULT_LIMIT;

    const posts = await prisma.post.findMany({
      where: { userId },
      include: postDataInclude(user.id),
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

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
