import { Hono } from "hono";
import user from "./routes/auth";

const app = new Hono().basePath("/api/v1");
app.route("/auth", user);

export default {
  port: 3000,
  fetch: app.fetch,
};
