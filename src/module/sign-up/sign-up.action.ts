"use server";

import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { streamServerClient } from "@app/api/_core/getStream-instance";
import { lucia } from "@app/api/_core/lucia-auth";
import prisma from "@app/api/_core/prisma";

import { signUpSchema, SignUpValues } from "./sign-up.dto";

// https://lucia-auth.com/tutorials/username-and-password/nextjs-app
// implement db query and insert based on db using
export async function signUp(
  credentials: SignUpValues,
): Promise<{ error: string }> {
  try {
    const { username, email, password } = signUpSchema.parse(credentials);

    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const userId = generateIdFromEntropySize(10);

    // https://www.prisma.io/docs/orm/reference/prisma-client-reference#findfirst
    // https://www.prisma.io/docs/orm/reference/prisma-client-reference#mode
    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (existingUsername) {
      return {
        error: "Username already taken",
      };
    }

    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (existingEmail) {
      return {
        error: "Email already taken",
      };
    }

    // https://www.prisma.io/docs/orm/prisma-client/queries/transactions#interactive-transactions
    // khác với like là sequential transaction
    // trade off chờ create user xong mới upsert user lên stream
    await prisma.$transaction(async tx => {
      // https://www.prisma.io/docs/orm/reference/prisma-client-reference#create
      await tx.user.create({
        data: {
          id: userId,
          username,
          displayName: username,
          email,
          passwordHash,
        },
      });
      await streamServerClient.upsertUser({
        id: userId,
        username,
        name: username,
      });
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    // return về 1 function return never sẽ skip được Promise<{ error: string }> define ở trên
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
