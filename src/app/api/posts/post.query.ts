import { Prisma } from "@prisma/client";

import { userDataSelect } from "@app/api/users/user.query";

// query này use-server-only
// client ko được phép truy cập

export const postDataInclude = (loggedInUserId: string) =>
  ({
    user: {
      select: userDataSelect(loggedInUserId),
    },
    attachments: true,
    likes: {
      // Thực chất là trả isLiked cho client
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    bookmarks: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    // ko select comment nhưng vẫn count được
    // -> ORM xử lý ngầm
    _count: {
      select: {
        likes: true,
        comments: true,
      },
    },
  }) satisfies Prisma.PostInclude;
