import { validateRequest } from "@app/api/_core/lucia-auth";
import prisma from "@app/api/_core/prisma";
import { LikeInfo, PostIdParam } from "@app/api/posts/post.prisma";

export async function GET(_: Request, { params: { postId } }: PostIdParam) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Dùng findUnique ko dùng findFirst vì id là unique constraint
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        likes: {
          // chỉ trả isLiked cho client, arr =[{userId}] hoặc []
          where: {
            userId: loggedInUser.id,
          },
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    const data: LikeInfo = {
      likes: post._count.likes,
      isLikedByUser: !!post.likes.length,
    };
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(_: Request, { params: { postId } }: PostIdParam) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.like.upsert({
      where: {
        userId_postId: {
          userId: loggedInUser.id,
          postId,
        },
      },
      create: {
        userId: loggedInUser.id,
        postId,
      },
      update: {},
    });

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params: { postId } }: PostIdParam) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.like.deleteMany({
      where: {
        userId: loggedInUser.id,
        postId,
      },
    });

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
