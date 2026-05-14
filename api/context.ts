import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "@db/schema";
import { authenticateRequest } from "./kimi/auth";
import { verifyLocalToken } from "./local-auth-router";
import { getDb } from "./queries/connection";
import { localUsers } from "@db/schema";
import { eq } from "drizzle-orm";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: User;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };

  // Try OAuth first
  try {
    ctx.user = await authenticateRequest(opts.req.headers);
  } catch {
    // OAuth not available
  }

  // If no OAuth user, try local auth
  if (!ctx.user) {
    try {
      const localToken = opts.req.headers.get("x-local-auth-token");
      if (localToken) {
        const payload = await verifyLocalToken(localToken);
        if (payload) {
          const db = getDb();
          const users = await db
            .select()
            .from(localUsers)
            .where(eq(localUsers.id, payload.userId));
          if (users.length > 0) {
            const lu = users[0];
            // Create a compatible User object
            ctx.user = {
              id: lu.id,
              unionId: `local_${lu.id}`,
              name: lu.displayName ?? lu.username,
              email: lu.email,
              avatar: null,
              role: lu.role,
              subscriptionTier: lu.subscriptionTier,
              searchesRemaining: lu.searchesRemaining,
              createdAt: lu.createdAt,
              updatedAt: lu.updatedAt,
              lastSignInAt: lu.updatedAt,
            } as User;
          }
        }
      }
    } catch {
      // Local auth not available
    }
  }

  return ctx;
}
