"use server";

import { verify } from "@node-rs/argon2";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { lucia } from "@app/api/_core/lucia-auth";
import prisma from "@app/api/_core/prisma";

import { signInSchema, SignInValues } from "./sign-in.dto";

// sign-in with password only
export async function signIn(
  credentials: SignInValues,
): Promise<{ error: string }> {
  try {
    const { username, password } = signInSchema.parse(credentials);

    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    // TODO: what if user login with non-password method, OAuth, etc.
    if (!existingUser || !existingUser.passwordHash) {
      return {
        error: "Incorrect username or password",
      };
    }

    const validPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) {
      return {
        error: "Incorrect username or password",
      };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return redirect("/");
  } catch (error) {
    // gotcha khi dùng redirect return ở trên, nếu redirect fail phải catch throw lần nữa
    if (isRedirectError(error)) throw error;
    console.error(error);
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}
