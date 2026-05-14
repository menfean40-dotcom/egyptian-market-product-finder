import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { messages } from "@db/schema";
import { desc, eq } from "drizzle-orm";

export const contactRouter = createRouter({
  submit: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        subject: z.string().optional(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(messages).values({
        name: input.name,
        email: input.email,
        subject: input.subject ?? null,
        content: input.content,
      });
      return {
        id: Number(result[0].insertId),
        name: input.name,
        email: input.email,
        subject: input.subject,
        content: input.content,
        isRead: false,
        createdAt: new Date(),
      };
    }),

  list: adminQuery
    .input(
      z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(messages)
        .orderBy(desc(messages.createdAt))
        .limit(input.limit)
        .offset(input.offset);
    }),

  markRead: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(messages)
        .set({ isRead: true })
        .where(eq(messages.id, input.id));
      const result = await db
        .select()
        .from(messages)
        .where(eq(messages.id, input.id));
      return result[0];
    }),
});
