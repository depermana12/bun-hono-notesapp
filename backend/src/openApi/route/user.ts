import { createRoute } from "@hono/zod-openapi";
import * as s from "../../schema/user";
import { ErrorSchema } from "../../schema/error";
import { TokenSchema } from "../../schema/queryParam";

export const registerRoute = createRoute({
  method: "post",
  path: "/signup",
  tags: ["user"],
  description: "register a new user",
  request: {
    body: {
      content: {
        "application/json": {
          schema: s.CreateUserSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: s.generateUserResponseSchema(s.UserSchema, "user created"),
        },
      },
      description: "user created successfully",
    },
    400: {
      description: "invalid data",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});

export const signInRoute = createRoute({
  method: "post",
  path: "/signin",
  tags: ["user"],
  description: "login as a user with email and password",
  request: {
    body: {
      content: {
        "application/json": {
          schema: s.SignInUserSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "user logged in successfully",
      content: {
        "application/json": {
          schema: s.generateUserResponseSchema(s.UserSchema, "user logged in"),
        },
      },
    },
    400: {
      description: "invalid email or password",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});

export const signOutRoute = createRoute({
  method: "get",
  path: "/signout",
  tags: ["user"],
  description: "logout a user",
  responses: {
    200: {
      description: "logged out",
    },
  },
});

export const forgetPasswordRoute = createRoute({
  method: "post",
  path: "/forget-password",
  tags: ["user"],
  description: "send email to reset password",
  request: {
    body: {
      description: "email to send reset password instructions",
      content: {
        "application/json": {
          schema: s.ForgetPasswordSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "email sent with instructions to reset password",
      content: {
        "application/json": {
          schema: s.ForgetPasswordResponseSchema,
        },
      },
    },
    400: {
      description: "invalid email",
      content: {
        "application/json": {
          schema: s.ForgetPasswordResponseSchema,
        },
      },
    },
  },
});

export const resetPasswordRoute = createRoute({
  method: "post",
  path: "/reset-password/{token}",
  tags: ["user"],
  description: "reset password with token",
  request: {
    params: TokenSchema,
    body: {
      description: "new password and token",
      content: {
        "application/json": {
          schema: s.ResetPasswordSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "password reset success",
      content: {
        "application/json": {
          schema: s.ResetPasswordResponseSchema,
        },
      },
    },
    400: {
      description: "failed to reset password",
      content: {
        "application/json": {
          schema: s.ResetPasswordResponseSchema,
        },
      },
    },
  },
});
