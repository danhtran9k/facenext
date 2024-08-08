import { validateRequest } from "@core/lucia-auth";
import prisma from "@core/prisma";
import { UserIdParam } from "@core/prisma/post.prisma";
import { userDataSelect } from "@core/prisma/user.query";

// Tuy là userId nhưng sẽ query theo userName
export async function GET(_: Request, { params: { userId } }: UserIdParam) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
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
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
