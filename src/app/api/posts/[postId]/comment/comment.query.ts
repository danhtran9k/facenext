import { Prisma } from "@prisma/client";

import { userDataSelect } from "@app/api/users/user.query";

export function getCommentDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: userDataSelect(loggedInUserId),
    },
  } satisfies Prisma.CommentInclude;
}
