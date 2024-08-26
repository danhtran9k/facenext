import { generateCodeVerifier, generateState } from "arctic";
import { cookies } from "next/headers";

import { google } from "@app/api/_core/google-oauth";

export async function GET() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  // Scope chọn trong lúc setup OAuth consent screen
  // url trả về chính là url redirect đăng kí trên google console
  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ["profile", "email"],
  });

  // https://arctic.js.org/guides/oauth2
  // PKCE (Proof Key for Code Exchange) -> addition protection for production
  // gg sử dụng dạng trên
  cookies().set("state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  // https://arctic.js.org/guides/oauth2-pkce
  cookies().set("code_verifier", codeVerifier, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return Response.redirect(url);
}
