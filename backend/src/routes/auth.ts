import AuthService from "../services/auth";
import { OpenAPIHono } from "@hono/zod-openapi";
import * as r from "../openApi/route/user";
import { HTTPException } from "hono/http-exception";

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

user.openapi(r.signOutRoute, async (c) => {
  const { user } = c.get("jwtPayload");
  await auth.signOut(user);
  return c.json({ message: "user signed out" }, 200);
});

user.openapi(r.forgetPasswordRoute, async (c) => {
  const { email } = c.req.valid("json");
  await auth.forgotPassword(email);
  return c.json(
    {
      message: "email sent",
    },
    200,
  );
});

user.openapi(r.resetPasswordRoute, async (c) => {
  const { password } = c.req.valid("json");
  const token = c.req.param("token");
  if (!token) {
    throw new HTTPException(400, { message: "token is required" });
  }
  await auth.resetPassword(token, password);
  return c.json(
    {
      message: "password reset successful",
    },
    200,
  );
});

export default user;
