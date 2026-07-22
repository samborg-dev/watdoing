import { and, eq, gte, lte, or } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { friendships, noteShares, notes } from "~/server/db/schema";

// What the board renders: a note plus this viewer's access level.
export type NoteAccess = "owner" | "edit" | "view";

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "expected YYYY-MM-DD");

async function friendsAccepted(
  db: (typeof import("~/server/db"))["db"],
  a: string,
  b: string,
) {
  const row = await db.query.friendships.findFirst({
    where: and(
      eq(friendships.status, "accepted"),
      or(
        and(eq(friendships.requesterId, a), eq(friendships.addresseeId, b)),
        and(eq(friendships.requesterId, b), eq(friendships.addresseeId, a)),
      ),
    ),
  });
  return !!row;
}

export const noteRouter = createTRPCRouter({
  // Notes the user owns OR that were shared with them, within a date range.
  list: protectedProcedure
    .input(z.object({ start: dateStr, end: dateStr }))
    .query(async ({ ctx, input }) => {
      const uid = ctx.session.user.id;

      const owned = await ctx.db.query.notes.findMany({
        where: and(
          eq(notes.userId, uid),
          gte(notes.date, input.start),
          lte(notes.date, input.end),
        ),
      });

      const shared = await ctx.db
        .select({ note: notes, permission: noteShares.permission })
        .from(noteShares)
        .innerJoin(notes, eq(noteShares.noteId, notes.id))
        .where(
          and(
            eq(noteShares.userId, uid),
            gte(notes.date, input.start),
            lte(notes.date, input.end),
          ),
        );

      return [
        ...owned.map((n) => ({ ...n, access: "owner" as NoteAccess })),
        ...shared.map((s) => ({
          ...s.note,
          access: s.permission as NoteAccess,
        })),
      ];
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(256),
        description: z.string().max(2000).optional(),
        theme: z.string().max(32),
        date: dateStr,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [created] = await ctx.db
        .insert(notes)
        .values({
          userId: ctx.session.user.id,
          title: input.title,
          description: input.description ?? "",
          theme: input.theme,
          date: input.date,
        })
        .returning();
      return created!;
    }),

  setDone: protectedProcedure
    .input(z.object({ id: z.string(), done: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const uid = ctx.session.user.id;
      const note = await ctx.db.query.notes.findFirst({
        where: eq(notes.id, input.id),
      });
      if (!note) return null;

      // Owner, or someone the note was shared with edit rights.
      let canEdit = note.userId === uid;
      if (!canEdit) {
        const share = await ctx.db.query.noteShares.findFirst({
          where: and(
            eq(noteShares.noteId, input.id),
            eq(noteShares.userId, uid),
          ),
        });
        canEdit = share?.permission === "edit";
      }
      if (!canEdit) return null;

      await ctx.db
        .update(notes)
        .set({ done: input.done })
        .where(eq(notes.id, input.id));
      return { id: input.id, done: input.done };
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Only the owner can delete. Shares cascade away with the note.
      await ctx.db
        .delete(notes)
        .where(
          and(eq(notes.id, input.id), eq(notes.userId, ctx.session.user.id)),
        );
      return { id: input.id };
    }),

  // Share one of your notes with a friend.
  share: protectedProcedure
    .input(
      z.object({
        noteId: z.string(),
        friendId: z.string(),
        permission: z.enum(["view", "edit"]).default("view"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const uid = ctx.session.user.id;

      const note = await ctx.db.query.notes.findFirst({
        where: and(eq(notes.id, input.noteId), eq(notes.userId, uid)),
      });
      if (!note) return null; // not yours to share

      const areFriends = await friendsAccepted(ctx.db, uid, input.friendId);
      if (!areFriends) return null;

      await ctx.db
        .insert(noteShares)
        .values({
          noteId: input.noteId,
          userId: input.friendId,
          permission: input.permission,
        })
        .onConflictDoUpdate({
          target: [noteShares.noteId, noteShares.userId],
          set: { permission: input.permission },
        });
      return { noteId: input.noteId, friendId: input.friendId };
    }),
});
