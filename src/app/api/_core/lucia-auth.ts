import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Prisma } from "@prisma/client";
import { Lucia, Session, User } from "lucia";
import { cookies } from "next/headers";
import { cache } from "react";

import prisma from "./prisma";

// https://lucia-auth.com/database/prisma
const adapter = new PrismaAdapter(prisma.session, prisma.user);

// https://lucia-auth.com/getting-started/nextjs-app
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    // this sets cookies with super long expiration
    // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
    expires: false,
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  // https://lucia-auth.com/basics/users
  // https://github.com/lucia-auth/examples/blob/main/nextjs-app/github-oauth/lib/auth.ts
  getUserAttributes(databaseUserAttributes) {
    return {
      id: databaseUserAttributes.id,
      username: databaseUserAttributes.username,
      displayName: databaseUserAttributes.displayName,
      avatarUrl: databaseUserAttributes.avatarUrl,
      googleId: databaseUserAttributes.googleId,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

// interface DatabaseUserAttributes {
// 	id: string;
// 	username: string;
// 	displayName: string;
// 	avatarUrl: string | null;
// 	googleId: string | null;
//   }

// https://www.prisma.io/docs/orm/prisma-client/type-safety/operating-against-partial-structures-of-model-types#solution
type DatabaseUserAttributes = Prisma.UserGetPayload<{
  select: {
    id: true;
    username: true;
    displayName: true;
    avatarUrl: true;
    googleId: true;
  };
}>;

//   interface DatabaseUserAttributes extends Pick<Prisma.UserGetPayload<{}>,
//   'id' | 'username' | 'displayName' | 'avatarUrl' | 'googleId'
// > {}

// https://lucia-auth.com/guides/validate-session-cookies/nextjs-app
// type của Lucia, ko phải Prisma

export type TLuciaValidate =
  | {
      user: User;
      session: Session;
    }
  | {
      user: null;
      session: null;
    };

export const validateRequest = cache(async (): Promise<TLuciaValidate> => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId)
    return {
      user: null,
      session: null,
    };

  // ko destruct ra để tiện return khớp type
  const result = await lucia.validateSession(sessionId);
  const { session } = result;

  try {
    if (session?.fresh) {
      setCookieFromLuciaSessionId(session.id);
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch {
    // Next.js throws error when attempting to set cookies when rendering page
  }

  return result;
});

export const setCookieFromLuciaSessionId = (luciaSessionId: string) => {
  if (!luciaSessionId) return;

  const sessionCookie = lucia.createSessionCookie(luciaSessionId);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
};

export const luciaSetCookieByUserId = async (userId: string) => {
  // NOTE: only call this with valid - pre-existed userId
  const session = await lucia.createSession(userId, {});
  setCookieFromLuciaSessionId(session.id);
};
