import { cors } from "hono/cors";
import { logger } from "hono/logger";
import userHandler from "./routes/auth";
import noteHandler from "./routes/note";
import { serveStatic } from "hono/bun";
import { HTTPException } from "hono/http-exception";
import jwtMiddleware from "./middlewares/jwtMiddleware";
import { Hono } from "hono";

const app = new Hono().basePath("/api/v1");
app.use(cors());
app.use(logger());
app.get("*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));

app.route("/auth", userHandler);
app.use(jwtMiddleware);
app.route("/notes", noteHandler);

app.notFound((c) => {
  return c.json({ error: "you lost bruh" }, 404);
});

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status);
  }
  return c.json({ error: "oopss thats on us" }, 500);
});

export default app;
