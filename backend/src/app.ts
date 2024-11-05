import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import userHandler from "./routes/auth";
import noteHandler from "./routes/note";
import { HTTPException } from "hono/http-exception";
import jwtMiddleware from "./middlewares/jwtMiddleware";

const app = new Hono().basePath("/api/v1");

app.use(cors());
app.use(logger());
// public routes
app.route("/auth", userHandler);

// protected routes
app.use(jwtMiddleware);
app.route("/notes", noteHandler);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status);
  }
  return c.json({ error: "oopss thats on us" }, 500);
});

export default app;
