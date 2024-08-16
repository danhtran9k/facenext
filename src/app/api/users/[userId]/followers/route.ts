import { INTERNAL_ERROR, UNAUTHORIZED_ERROR } from "@app/api/_core/api.common";
import { validateRequest } from "@app/api/_core/lucia-auth";
import prisma from "@app/api/_core/prisma";
import { FollowerInfo, UserIdParam } from "@app/api/posts/post.prisma";

export async function GET(_: Request, { params: { userId } }: UserIdParam) {
  try {
    const { user: loggedInUser } = await validateRequest();

    // guard api request
    // api này mục tiêu query xem user đang check có follow mình ko
    // và chỉ show số followers của user đó mà ko show detail là ai
    // Ý tưởng hơi trật khớp 1 tí, đúng ra phải có concept private / public
    if (!loggedInUser) {
      return UNAUTHORIZED_ERROR;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        followers: {
          where: {
            followerId: loggedInUser.id,
          },
          select: {
            followerId: true,
          },
        },
        _count: {
          select: {
            followers: true,
          },
        },
      },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const data: FollowerInfo = {
      followers: user._count.followers,
      isFollowedByUser: !!user.followers.length,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return INTERNAL_ERROR;
  }
}

// Viết thành server action chuẩn hơn
// Ở đây chỉ demo api - next router app cũ
export async function POST(_: Request, { params: { userId } }: UserIdParam) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return UNAUTHORIZED_ERROR;
    }

    const follow = {
      followerId: loggedInUser.id,
      followingId: userId,
    };

    await prisma.follow.upsert({
      where: {
        // Chính là unique_constraint trong prisma schema
        followerId_followingId: follow,
      },
      // syntax của upsert prisma only - đã được orm wrapped, 3 field required
      // https://www.prisma.io/docs/orm/reference/prisma-client-reference#upsert
      create: follow,
      update: {},
    });

    // success Upsert
    return new Response();
  } catch (error) {
    console.error(error);
    return INTERNAL_ERROR;
  }
}

export async function DELETE(_: Request, { params: { userId } }: UserIdParam) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return UNAUTHORIZED_ERROR;
    }

    const follow = {
      followerId: loggedInUser.id,
      followingId: userId,
    };

    // deleteMany ko throw error nếu không tìm thấy record
    await prisma.follow.deleteMany({
      where: follow,
    });

    return new Response();
  } catch (error) {
    console.error(error);
    return INTERNAL_ERROR;
  }
}
