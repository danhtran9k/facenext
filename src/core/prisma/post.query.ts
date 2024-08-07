import { Prisma } from "@prisma/client";

import { userDataSelect } from "./user.query";

// query này use-server-only
// client ko được phép truy cập

export const postDataInclude = (loggedInUserId: string) =>
  ({
    user: {
      select: userDataSelect(loggedInUserId),
    },
  }) satisfies Prisma.PostInclude;
