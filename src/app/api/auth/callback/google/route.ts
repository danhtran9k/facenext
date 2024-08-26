import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { INTERNAL_ERROR, RES_GOOGLE_REDIRECT } from "@app/api/_core/api.common";
import { streamServerClient } from "@app/api/_core/getStream-instance";
import { getUserLogByGoogle } from "@app/api/_core/google-oauth";
import { luciaSetCookieByUserId } from "@app/api/_core/lucia-auth";
import prisma from "@app/api/_core/prisma";
import { slugify } from "@app/api/_core/server.helper";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  const storedState = cookies().get("state")?.value;
  const storedCodeVerifier = cookies().get("code_verifier")?.value;

  if (
    !code ||
    !state ||
    !storedState ||
    !storedCodeVerifier ||
    //
    state !== storedState
  ) {
    return new Response(null, { status: 400 });
  }

  try {
    const { existingUser, googleUser } = await getUserLogByGoogle(
      code,
      storedCodeVerifier,
    );

    if (existingUser) {
      await luciaSetCookieByUserId(existingUser.id);
      return RES_GOOGLE_REDIRECT;
    }

    // Logic create new User by Google OAuth khác với signUp, ko nên cố merge
    // TODO: tuy nhiên logic TRANSACTION này có vấn đề, flow transact thì lại giống nhau
    // Vẫn có điểm chung là update thêm getStream data
    // https://lucia-auth.com/reference/main/generateIdFromEntropySize
    const userId = generateIdFromEntropySize(10);

    const username = slugify(googleUser.name) + "-" + userId.slice(0, 4);

    // Thật ra bọc transact mục tiêu bảo vệ db,
    // Ko có tác dụng revert streamServer
    await prisma.$transaction(async tx => {
      await tx.user.create({
        data: {
          id: userId,
          username,
          displayName: googleUser.name,
          googleId: googleUser.id,
        },
      });
      await streamServerClient.upsertUser({
        id: userId,
        username,
        name: username,
      });
    });

    // Phải chờ userId set trước vì transact ko revert lucia được
    await luciaSetCookieByUserId(userId);

    return RES_GOOGLE_REDIRECT;
  } catch (error) {
    console.error(error);
    if (error instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 400,
      });
    }
    return INTERNAL_ERROR;
  }
}
