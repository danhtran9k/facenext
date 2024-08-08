import { Prisma } from "@prisma/client";

// ref xem user đang check có đã có theo dõi loggedInUser chưa
// tức là query dưới userA dưới góc nhìn của userB
// -> userB (self viewPoint) có theo dõi userA chưa
// chỗ này logginUserId ko cần valid
// logic hơi xoắn não và relation follow
export const userDataSelect = (loggedInUserId: string) =>
  ({
    id: true,
    username: true,
    displayName: true,
    avatarUrl: true,
    bio: true,
    createdAt: true,
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
        posts: true,
        followers: true,
      },
    },
  }) satisfies Prisma.UserSelect;

export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof userDataSelect>;
}>;
