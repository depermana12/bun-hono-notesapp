import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import { HTTPException } from "hono/http-exception";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./routes";
import { Hono } from "hono";

const app = new Hono();
app.use(logger());
app.get("*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));

app.use(
  "/api/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext: (_opts, c) => ({
      c: c,
    }),
  }),
);

app.notFound((c) => {
  return c.json({ error: "you lost bruh" }, 404);
});

app.onError((err, c) => {
  if (err instanceof HTTPException)
    return c.json({ error: err.message }, err.status);

  return c.json({ error: "oopss thats on us" }, 500);
});

export default app;
