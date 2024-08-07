import { notFound } from "next/navigation";
import { cache } from "react";

import prisma from "@core/prisma";
import { userDataSelect } from "@core/prisma/user.query";

export const getUserProfile = cache(
  async (username: string, loggedInUserId: string) => {
    // https://www.prisma.io/docs/orm/prisma-client/queries/crud#get-the-first-record-that-matches-a-specific-criteria
    // prisma ORM ko có findOne, có find Unique
    // findUnique bắt buộc phải define unique trong schema mới dùng được
    // findFirst tổng quát hơn
    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
      // Query user profile dưới góc nhìn của loggedInUser
      // check xem user đó mình có follow chưa
      select: userDataSelect(loggedInUserId),
    });

    // https://nextjs.org/docs/app/api-reference/functions/not-found
    if (!user) notFound();

    return user;
  },
);
