import { initTRPC } from "@trpc/server";
import { Context } from "hono";

type HonoContext = {
  c: Context;
};

const t = initTRPC.context<HonoContext>().create();

export const publicProcedure = t.procedure;
export const router = t.router;
