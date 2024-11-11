import AuthService from "../services/auth";
import * as s from "../schema/user";
import { HTTPException } from "hono/http-exception";
import { publicProcedure, router } from "../trpc";
import { z } from "zod";

const auth = new AuthService();

export const noteRouter = router({
  signup: publicProcedure
    .input(s.CreateUserSchema)
    .mutation(async ({ input, ctx }) => {
      const { user, token } = await auth.signUp(input);
      return {
        message: "user created",
        data: user,
        token,
      };
    }),
  signin: publicProcedure
    .input(s.SignInUserSchema)
    .mutation(async ({ input, ctx }) => {
      const { user, token } = await auth.signIn(input);
      return {
        message: "user logged in",
        data: user,
        token,
      };
    }),
  signout: publicProcedure.input(z.object({})).mutation(async ({ ctx }) => {
    const { user } = ctx.c.get("jwtPayload");
    await auth.signOut(user);
    return { message: "user signed out" };
  }),
  forgetPassword: publicProcedure
    .input(s.ForgetPasswordSchema)
    .mutation(async ({ input, ctx }) => {
      await auth.forgotPassword(input.email);
      return {
        message: "email sent",
      };
    }),
  resetPassword: publicProcedure
    .input(s.ResetPasswordSchema)
    .mutation(async ({ input, ctx }) => {
      const token = ctx.c.param("token");
      if (!token) {
        throw new HTTPException(400, { message: "token is required" });
      }
      await auth.resetPassword(token, input.password);
      return {
        message: "password reset successful",
      };
    }),
});
