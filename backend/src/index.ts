import { Hono } from "hono";
import user from "./routes/auth";
import { HTTPException } from "hono/http-exception";

const app = new Hono().basePath("/api/v1");
app.route("/auth", user);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status);
  }
  return c.json({ error: "oopss thats on us" }, 500);
});

export default {
  port: 3000,
  fetch: app.fetch,
};
