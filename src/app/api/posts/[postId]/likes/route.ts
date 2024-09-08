import {
  INTERNAL_ERROR,
  UNAUTHORIZED_ERROR,
  resourceNotFound,
} from "@app/api/_core/api.common";
import { validateRequest } from "@app/api/_core/lucia-auth";
import prisma from "@app/api/_core/prisma";

import { prismaNotiCreate } from "@app/api/notifications/noti-create.query";
import { privateGetPostById } from "@app/api/posts/getPost.action";
import { LikeInfo, PostIdParam } from "@app/api/posts/post.prisma";

export async function GET(_: Request, { params: { postId } }: PostIdParam) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return UNAUTHORIZED_ERROR;
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
      return resourceNotFound("Post");
    }

    const data: LikeInfo = {
      likes: post._count.likes,
      isLikedByUser: !!post.likes.length,
    };
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return INTERNAL_ERROR;
  }
}

export async function POST(_: Request, { params: { postId } }: PostIdParam) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return UNAUTHORIZED_ERROR;
    }

    const post = await privateGetPostById(postId);
    if (!post) {
      return resourceNotFound("Post");
    }

    // wrap vào transac để đảm bảo rằng noti chắc chắn được gửi
    // TH này nếu ko consider noti quan trọng có thể await riêng hoặc SSE riêng về client sau, hoặc socket cũng là 1 option khác
    // Tùy mức độ có thể đẩy lên MQ , hoặc tracking noti fail ...
    // Tuy nhiên chú ý MQ thì chưa rõ xử lý dB ntn
    // https://www.prisma.io/docs/orm/prisma-client/queries/transactions
    await prisma.$transaction([
      prisma.like.upsert({
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
      }),
      ...prismaNotiCreate({
        issuerId: loggedInUser.id,
        recipientId: post.userId,
        type: "LIKE",
        postId,
        allowSelfNoti: false,
      }),
    ]);

    return new Response();
  } catch (error) {
    console.error(error);
    return INTERNAL_ERROR;
  }
}

export async function DELETE(_: Request, { params: { postId } }: PostIdParam) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return UNAUTHORIZED_ERROR;
    }

    const post = await privateGetPostById(postId);
    if (!post) {
      return resourceNotFound("Post");
    }

    await prisma.$transaction([
      prisma.like.deleteMany({
        where: {
          userId: loggedInUser.id,
          postId,
        },
      }),
      // TODO: deleteMany ko throw Error nên ko cần đưa thành condition như trên
      // Tuy nhiên đánh đổi performance chỗ này ko tốt
      // Ngoài ra case deleteLike Noti khá hẹp,
      // so sánh với case delete Follower thì lại ko có postId
      // hàm ko chặt chẽ sẽ rất phiền vì logic delete nhạy cảm
      prisma.notification.deleteMany({
        where: {
          issuerId: loggedInUser.id,
          recipientId: post.userId,
          postId,
          type: "LIKE",
        },
      }),
    ]);

    return new Response();
  } catch (error) {
    console.error(error);
    return INTERNAL_ERROR;
  }
}
