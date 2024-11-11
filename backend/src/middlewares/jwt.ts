import { createMiddleware } from "../trpc";

export const isAuthed = createMiddleware(async (opts) => {
  const { ctx } = opts;
  const { userId } = ctx.c.get("jwtPayload");

  return opts.next({
    ctx: {
      ...ctx,
      user: {
        id: userId,
      },
    },
  });
});
