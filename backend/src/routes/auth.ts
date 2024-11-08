import AuthService from "../services/auth";
import { OpenAPIHono } from "@hono/zod-openapi";
import * as r from "../openApi/route/user";

const auth = new AuthService();
const user = new OpenAPIHono();

user.openapi(r.registerRoute, async (c) => {
  const validatedUserInput = c.req.valid("json");
  const { user, token } = await auth.signUp(validatedUserInput);
  return c.json(
    {
      message: "user created",
      data: user,
      token,
    },
    201,
  );
});

user.openapi(r.signInRoute, async (c) => {
  const validatedUserLogin = c.req.valid("json");
  const { user, token } = await auth.signIn(validatedUserLogin);
  return c.json(
    {
      message: "user logged in",
      data: user,
      token,
    },
    200,
  );
});

export default user;
