import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "hono";
import { JwtVariables } from "hono/jwt";

type Payload = {
  userId: number;
};

type Variables = JwtVariables<Payload>;

type HonoContext = {
  c: Context<{ Variables: Variables }>;
  user?: {
    id: number;
  };
};

const t = initTRPC.context<HonoContext>().create();

export const isAuthed = t.middleware(async (opts) => {
  const { ctx } = opts;
  const payload = ctx.c.get("jwtPayload");
  console.log(payload);
  if (!payload || !payload.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "missing or invalid user token",
    });
  }

  return opts.next({
    ctx: {
      ...ctx,
      user: {
        id: payload.userId,
      },
    },
  });
});

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const router = t.router;
export const createMiddleware = t.middleware;
