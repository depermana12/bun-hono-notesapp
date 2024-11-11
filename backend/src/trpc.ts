import { initTRPC } from "@trpc/server";
import { isAuthed } from "./middlewares/jwt";
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

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const router = t.router;
export const createMiddleware = t.middleware;
