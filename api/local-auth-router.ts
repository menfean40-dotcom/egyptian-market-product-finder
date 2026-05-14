import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { localUsers } from "@db/schema";
import { eq } from "drizzle-orm";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.LOCAL_AUTH_SECRET || "genie-local-auth-secret-key-2025"
);

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "genie-salt");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function createToken(userId: number, username: string): Promise<string> {
  return new SignJWT({ userId, username })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function verifyLocalToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, { clockTolerance: 60 });
    return payload as { userId: number; username: string };
  } catch {
    return null;
  }
}

export const localAuthRouter = createRouter({
  register: publicQuery
    .input(
      z.object({
        username: z.string().min(3).max(255),
        password: z.string().min(6),
        displayName: z.string().optional(),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = await db
        .select()
        .from(localUsers)
        .where(eq(localUsers.username, input.username));

      if (existing.length > 0) {
        throw new Error("Username already taken");
      }

      const passwordHash = await hashPassword(input.password);
      const result = await db.insert(localUsers).values({
        username: input.username,
        displayName: input.displayName ?? input.username,
        passwordHash,
        email: input.email ?? null,
      });

      const userId = Number(result[0].insertId);
      const token = await createToken(userId, input.username);

      return {
        token,
        user: {
          id: userId,
          username: input.username,
          name: input.displayName ?? input.username,
          displayName: input.displayName ?? input.username,
        },
      };
    }),

  login: publicQuery
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const users = await db
        .select()
        .from(localUsers)
        .where(eq(localUsers.username, input.username));

      if (users.length === 0) {
        throw new Error("Invalid username or password");
      }

      const user = users[0];
      const passwordHash = await hashPassword(input.password);

      if (user.passwordHash !== passwordHash) {
        throw new Error("Invalid username or password");
      }

      const token = await createToken(user.id, user.username);

      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.displayName ?? user.username,
          displayName: user.displayName ?? user.username,
        },
      };
    }),

  me: publicQuery.query(async ({ ctx }) => {
    const authHeader = ctx.req.headers.get("x-local-auth-token");
    if (!authHeader) return null;

    const payload = await verifyLocalToken(authHeader);
    if (!payload) return null;

    const db = getDb();
    const users = await db
      .select()
      .from(localUsers)
      .where(eq(localUsers.id, payload.userId));

    if (users.length === 0) return null;

    const user = users[0];
    return {
      id: user.id,
      username: user.username,
      name: user.displayName ?? user.username,
      displayName: user.displayName ?? user.username,
      email: user.email,
      role: user.role,
      subscriptionTier: user.subscriptionTier,
    };
  }),
});
