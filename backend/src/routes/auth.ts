import AuthService from "../services/auth";
import * as s from "../schema/user";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { ParamSchema } from "../schema/queryParam";
import { setCookie } from "hono/cookie";

const auth = new AuthService();

export const userRouter = router({
  signup: publicProcedure
    .input(s.CreateUserSchema)
    .mutation(async ({ input }) => {
      await auth.validateEmail(input.email);

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
      console.log("hono context", ctx.c);
      const { user, token, storedSession } = await auth.signIn(input);
      setCookie(ctx.c, "refresh_token", storedSession.token, {
        httpOnly: true,
        expires: storedSession.expires_at,
        maxAge: 7,
      });

      return {
        message: "user logged in",
        data: user,
        token,
      };
    }),
  getUser: publicProcedure.input(ParamSchema).query(async ({ input, ctx }) => {
    const user = await auth.getUser(input.id);
    return {
      data: user,
    };
  }),
  signout: publicProcedure.input(z.object({})).mutation(async ({ ctx }) => {
    const userId = ctx.user?.id;
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }
    await auth.signOut(userId);
    return { message: "user signed out" };
  }),
  forgetPassword: publicProcedure
    .input(s.ForgetPasswordSchema)
    .mutation(async ({ input }) => {
      await auth.forgotPassword(input.email);
      return {
        message: "email sent",
      };
    }),
  resetPassword: publicProcedure
    .input(s.ResetPasswordSchema)
    .mutation(async ({ input }) => {
      try {
        await auth.resetPassword(input.token, input.password);
        return {
          message: "password reset successful",
        };
      } catch (error) {
        const message =
          error instanceof z.ZodError
            ? error.issues[0].message
            : "Invalid or expired token";

        throw new TRPCError({
          code: "BAD_REQUEST",
          message,
        });
      }
    }),
});
