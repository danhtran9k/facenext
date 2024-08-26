import { Google } from "arctic";

import kyInstance from "@app/api/_core/ky";
import prisma from "@app/api/_core/prisma";

const GOOGLE_OAUTH_URL = "https://www.googleapis.com/oauth2/v1/userinfo";

type TGoogleUser = { id: string; name: string };

// https://arctic.js.org/providers/google
export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`,
);

export const getUserLogByGoogle = async (
  code: string,
  codeVerified: string,
) => {
  // https://arctic.js.org/providers/google
  const tokens = await google.validateAuthorizationCode(code, codeVerified);

  // ignore email address TH này -> re-check lại
  // Nếu vậy chấp nhận cùng 1 mail có thể log qua gg hoặc qua mail
  // 2 acc khác nhau, merge data sẽ khó
  const googleUser = await kyInstance
    .get(GOOGLE_OAUTH_URL, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    })
    .json<TGoogleUser>();

  // Có mark unique trong schema nên findUnique được
  // TODO: check googleUser email match existing acc email
  // Đúng ra phải find luôn email trùng với email TGoogleUser
  // Check logic xem có trùng ko ...
  const existingUser = await prisma.user.findUnique({
    where: {
      googleId: googleUser.id,
    },
  });

  return { googleUser, existingUser };
};
