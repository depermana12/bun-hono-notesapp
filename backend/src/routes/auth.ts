import AuthService from "../services/auth";
import * as s from "../schema/user";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { ParamSchema } from "../schema/queryParam";
import { getSignedCookie, setCookie, setSignedCookie } from "hono/cookie";

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
      await setSignedCookie(
        ctx.c,
        "refresh_token",
        storedSession.token,
        "baksosuper",
        {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          expires: storedSession.expires_at, // 1 week
          maxAge: 7,
          sameSite: "strict",
        },
      );

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
  refreshToken: publicProcedure
    .input(z.object({}))
    .mutation(async ({ ctx }) => {
      const refreshToken = await getSignedCookie(
        ctx.c,
        "refresh_token",
        "baksosuper",
      );
      if (!refreshToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "No refresh token found",
        });
      }

      const { newAccessToken, updatedSession } =
        await auth.validateRefreshToken(refreshToken);

      await setSignedCookie(
        ctx.c,
        "refresh_token",
        updatedSession.token,
        "baksosuper",
        {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          expires: updatedSession.expires_at,
          maxAge: 7,
        },
      );
      return {
        message: "token refreshed",
        token: newAccessToken,
      };
    }),
});
