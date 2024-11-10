import { createMiddleware } from "hono/factory";
import { jwt } from "hono/jwt";

const jwtMiddleware = createMiddleware((c, next) => {
  const jwtHandler = jwt({
    secret: Bun.env.JWT_SECRET!,
  });
  return jwtHandler(c, next);
});

export default jwtMiddleware;
