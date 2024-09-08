import { NextRequest } from "next/server";

import { INTERNAL_ERROR, UNAUTHORIZED_ERROR } from "@app/api/_core/api.common";
import { validateRequest } from "@app/api/_core/lucia-auth";
import { getPaginateSearchParams } from "@app/api/_core/pagination.helper";
import prisma from "@app/api/_core/prisma";

import {
  NotificationsPage,
  notificationsInclude,
} from "@app/api/notifications/noti.prisma";

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return UNAUTHORIZED_ERROR;
    }

    const { getDataAndCursor, paginateQuery, SORT_ORDER } =
      getPaginateSearchParams(req.nextUrl.searchParams);

    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: user.id,
      },
      include: notificationsInclude,
      orderBy: { createdAt: SORT_ORDER },
      ...paginateQuery,
    });

    const { cursor: nextCursor, dataPaginate } =
      getDataAndCursor(notifications);
    const data: NotificationsPage = {
      notifications: dataPaginate,
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return INTERNAL_ERROR;
  }
}
