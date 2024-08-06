import { Prisma } from "@prisma/client";

// query này use-server-only
// client ko được phép truy cập

export const userDataSelect = (loggedInUserId: string) =>
  ({
    id: true,
    username: true,
    displayName: true,
    avatarUrl: true,
    followers: {
      where: {
        followerId: loggedInUserId,
      },
      // select ra chỉ với mục đích trim bớt data
      select: {
        followerId: true,
      },
    },
    // Bản chất count này ko phụ thuộc vào select trong follower trên
    // sẽ count từ data gốc query ra !!
    // chỉ khi _count trong select mới trả 0 hoặc 1
    // - giống trong api/users/[userId]/followers
    // https://www.prisma.io/docs/orm/prisma-client/queries/aggregation-grouping-summarizing#count
    _count: {
      select: {
        followers: true,
      },
    },
  }) satisfies Prisma.UserSelect;

export const postDataInclude = (loggedInUserId: string) =>
  ({
    user: {
      select: userDataSelect(loggedInUserId),
    },
  }) satisfies Prisma.PostInclude;
