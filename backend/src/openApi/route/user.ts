import { createRoute } from "@hono/zod-openapi";
import * as s from "../../schema/user";
import { ErrorSchema } from "../../schema/error";

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
