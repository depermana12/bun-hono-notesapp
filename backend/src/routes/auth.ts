import { Hono } from "hono";
import AuthService from "../services/auth";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const auth = new AuthService();
const user = new Hono();

const signUpSchema = z.object({
  name: z.string().min(3, { message: "Must be 5 or more characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Must be 8 or more characters long" }),
});

user.post(
  "/signup",
  zValidator("json", signUpSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        { message: "invalid data", errors: result.error.issues[0].message },
        400,
      );
    }
  }),
  async (c) => {
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
  },
);

export default user;
