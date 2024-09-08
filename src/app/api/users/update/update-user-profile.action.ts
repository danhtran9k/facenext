"use server";

import { streamServerClient } from "@app/api/_core/getStream-instance";
import { validateRequest } from "@app/api/_core/lucia-auth";
import prisma from "@app/api/_core/prisma";

import { userDataSelect } from "@app/api/users/user.query";

import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "./update-user-profile.dto";

export async function updateUserProfile(values: UpdateUserProfileValues) {
  const validatedValues = updateUserProfileSchema.parse(values);

  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const updatedUser = await prisma.$transaction(async tx => {
    const updatedUser = await tx.user.update({
      where: { id: user.id },
      data: validatedValues,
      select: userDataSelect(user.id),
    });
    await streamServerClient.partialUpdateUser({
      id: user.id,
      set: {
        name: validatedValues.displayName,
      },
    });
    return updatedUser;
  });

  return updatedUser;
}
