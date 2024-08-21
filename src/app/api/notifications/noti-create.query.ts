import { NotificationType } from "@prisma/client";

import prisma from "@app/api/_core/prisma";

type TCreateNoti = {
  issuerId: string;
  recipientId: string;
  type: NotificationType;
  postId?: string;
  allowSelfNoti?: boolean;
};

export const prismaNotiCreate = ({
  issuerId,
  recipientId,
  type,
  postId,
  allowSelfNoti = true,
}: TCreateNoti) => {
  if (!allowSelfNoti && issuerId === recipientId) return [];

  return [
    prisma.notification.create({
      data: {
        issuerId,
        recipientId,
        type,
        postId,
      },
    }),
  ];
};
