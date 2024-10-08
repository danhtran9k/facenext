import {
  INTERNAL_ERROR,
  UNAUTHORIZED_ERROR,
  resourceNotFound,
} from "@app/api/_core/api.common";
import { validateRequest } from "@app/api/_core/lucia-auth";
import prisma from "@app/api/_core/prisma";

import { prismaNotiCreate } from "@app/api/notifications/noti-create.query";
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
      return resourceNotFound("User");
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

    // ko cho phép follow chính mình
    if (!loggedInUser || loggedInUser.id === userId) {
      return UNAUTHORIZED_ERROR;
    }

    const follow = {
      followerId: loggedInUser.id,
      followingId: userId,
    };

    await prisma.$transaction([
      prisma.follow.upsert({
        where: {
          // Chính là unique_constraint trong prisma schema
          followerId_followingId: follow,
        },
        // syntax của upsert prisma only - đã được orm wrapped, 3 field required
        // https://www.prisma.io/docs/orm/reference/prisma-client-reference#upsert
        create: follow,
        update: {},
      }),
      // Đã chặn case follow chính mình ở trên nên ko cần allowSelfNoti
      // chặt chẽ add vẫn ok
      ...prismaNotiCreate({
        issuerId: loggedInUser.id,
        recipientId: userId,
        type: "FOLLOW",
        allowSelfNoti: false,
      }),
    ]);

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

    if (!loggedInUser || loggedInUser.id === userId) {
      return UNAUTHORIZED_ERROR;
    }

    const followRelation = {
      followerId: loggedInUser.id,
      followingId: userId,
    };

    await prisma.$transaction([
      // deleteMany ko throw error nếu không tìm thấy record
      prisma.follow.deleteMany({
        where: followRelation,
      }),
      prisma.notification.deleteMany({
        where: {
          issuerId: loggedInUser.id,
          recipientId: userId,
          type: "FOLLOW",
        },
      }),
    ]);

    return new Response();
  } catch (error) {
    console.error(error);
    return INTERNAL_ERROR;
  }
}
