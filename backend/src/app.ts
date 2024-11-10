import { cors } from "hono/cors";
import { logger } from "hono/logger";
import userHandler from "./routes/auth";
import noteHandler from "./routes/note";
import { HTTPException } from "hono/http-exception";
import jwtMiddleware from "./middlewares/jwtMiddleware";
import { OpenAPIHono } from "@hono/zod-openapi";
import { openApiConfig } from "./openApi/config";
import { apiReference } from "@scalar/hono-api-reference";

const app = new OpenAPIHono().basePath("/api/v1");
app.use(cors());
app.use(logger());

app.doc("/docs", openApiConfig);
app.get(
  "/reference",
  apiReference({
    spec: {
      url: "/api/v1/docs",
    },
  }),
);
app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

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
