import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { z } from "zod";

import { env } from "~/env";
import { db } from "~/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "~/server/db/schema";

/**
 * Module augmentation so `session.user.id` and `token.id` are typed everywhere.
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/**
 * Google and GitHub read their `AUTH_<PROVIDER>_ID` / `AUTH_<PROVIDER>_SECRET`
 * env vars automatically (Auth.js v5 convention). They stay listed even without
 * credentials — the button just won't work until the env pair is set.
 */
export const authConfig = {
  // Credentials (email+password) forces JWT sessions; the DB adapter still
  // persists users/accounts and links OAuth logins.
  session: { strategy: "jwt" },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    // OAuth providers only appear when their credentials are configured,
    // so users never see a button that can't work.
    ...(env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET ? [Google] : []),
    ...(env.AUTH_GITHUB_ID && env.AUTH_GITHUB_SECRET ? [GitHub] : []),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (raw) => {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        });
        if (!user?.hashedPassword) return null;

        const valid = await compare(password, user.hashedPassword);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) (token as { id?: string }).id = user.id;
      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: (token as { id?: string }).id ?? session.user.id,
      },
    }),
  },
} satisfies NextAuthConfig;
