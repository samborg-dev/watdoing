import { TRPCError } from "@trpc/server";
import { and, eq, or } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { friendships, users } from "~/server/db/schema";

function publicUser(u: {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}) {
  return { id: u.id, name: u.name, email: u.email, image: u.image };
}

export const friendRouter = createTRPCRouter({
  // Send a friend request to a user by their email.
  request: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const me = ctx.session.user.id;

      const target = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
      });
      if (!target) {
        throw new TRPCError({ code: "NOT_FOUND", message: "No user with that email." });
      }
      if (target.id === me) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "You can't friend yourself." });
      }

      // Already a relationship in either direction?
      const existing = await ctx.db.query.friendships.findFirst({
        where: or(
          and(
            eq(friendships.requesterId, me),
            eq(friendships.addresseeId, target.id),
          ),
          and(
            eq(friendships.requesterId, target.id),
            eq(friendships.addresseeId, me),
          ),
        ),
      });
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            existing.status === "accepted"
              ? "You're already friends."
              : "A request already exists.",
        });
      }

      await ctx.db.insert(friendships).values({
        requesterId: me,
        addresseeId: target.id,
        status: "pending",
      });
      return publicUser(target);
    }),

  // Accept or decline an incoming request.
  respond: protectedProcedure
    .input(z.object({ requesterId: z.string(), accept: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const me = ctx.session.user.id;
      const where = and(
        eq(friendships.requesterId, input.requesterId),
        eq(friendships.addresseeId, me),
        eq(friendships.status, "pending"),
      );

      if (input.accept) {
        await ctx.db
          .update(friendships)
          .set({ status: "accepted" })
          .where(where);
      } else {
        await ctx.db.delete(friendships).where(where);
      }
      return { requesterId: input.requesterId, accepted: input.accept };
    }),

  // Accepted friends (either direction).
  list: protectedProcedure.query(async ({ ctx }) => {
    const me = ctx.session.user.id;
    const rows = await ctx.db.query.friendships.findMany({
      where: and(
        eq(friendships.status, "accepted"),
        or(eq(friendships.requesterId, me), eq(friendships.addresseeId, me)),
      ),
      with: { requester: true, addressee: true },
    });
    return rows.map((r) =>
      publicUser(r.requesterId === me ? r.addressee : r.requester),
    );
  }),

  // Incoming pending requests waiting on me.
  pending: protectedProcedure.query(async ({ ctx }) => {
    const me = ctx.session.user.id;
    const rows = await ctx.db.query.friendships.findMany({
      where: and(
        eq(friendships.addresseeId, me),
        eq(friendships.status, "pending"),
      ),
      with: { requester: true },
    });
    return rows.map((r) => publicUser(r.requester));
  }),
});
