"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { lucia, validateRequest } from "@core/lucia-auth";

// https://lucia-auth.com/tutorials/username-and-password/nextjs-app
// logic logout ko return gì cả, nếu ko authorize thì throw error, ko show mess gì hết
export async function logout() {
  const { session } = await validateRequest();
 
  if (!session) {
    throw new Error("Unauthorized");
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirect("/login");
}
