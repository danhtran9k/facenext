import { INTERNAL_ERROR, UNAUTHORIZED_ERROR } from "@app/api/_core/api.common";
import { validateRequest } from "@app/api/_core/lucia-auth";
import prisma from "@app/api/_core/prisma";
import { UserIdParam } from "@app/api/posts/post.prisma";
import { userDataSelect } from "@app/api/users/user.query";

// Tuy là userId nhưng sẽ query theo userName
export async function GET(_: Request, { params: { userId } }: UserIdParam) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return UNAUTHORIZED_ERROR;
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username: {
              equals: userId,
              mode: "insensitive",
            },
          },
          {
            id: {
              equals: userId,
              mode: "insensitive",
            },
          },
        ],
      },
      select: userDataSelect(loggedInUser.id),
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json(user);
  } catch (error) {
    console.error(error);
    return INTERNAL_ERROR;
  }
}
