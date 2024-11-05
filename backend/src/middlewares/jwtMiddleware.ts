import { createMiddleware } from "hono/factory";
import { jwt } from "hono/jwt";

const jwtMiddleware = createMiddleware((c, next) => {
  const jwtHandler = jwt({
    secret: "mieayam", // there is problem in bun to get .env
  });
  return jwtHandler(c, next);
});

export default jwtMiddleware;
