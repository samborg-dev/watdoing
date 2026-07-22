import { TRPCError } from "@trpc/server";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema";

export const userRouter = createTRPCRouter({
  // Email + password sign-up. Credentials has no built-in registration,
  // so we create the user (with a hashed password) ourselves.
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255).optional(),
        email: z.string().email(),
        password: z.string().min(8, "Use at least 8 characters."),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
      });
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "An account with that email already exists.",
        });
      }

      const hashedPassword = await hash(input.password, 10);
      const [created] = await ctx.db
        .insert(users)
        .values({
          name: input.name,
          email: input.email,
          hashedPassword,
        })
        .returning({ id: users.id, email: users.email });

      return created!;
    }),
});
