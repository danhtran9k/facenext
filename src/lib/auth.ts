import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Lucia } from "lucia";
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
			secure: process.env.NODE_ENV === "production"
		}
	}
});

declare module "lucia" {
	interface Register { 
		Lucia: typeof lucia;
	}
}