import { z } from "@hono/zod-openapi";

export const UserSchema = z
  .object({
    id: z.number().int().positive().openapi({
      example: 1,
      description: "Unique identifier for the user",
    }),
    name: z.string().min(1).max(255).openapi({
      example: "John Doe",
      description: "User's full name",
    }),
    email: z.string().email().openapi({
      example: "johndoe@example.com",
      description: "User's email address",
    }),
    created_at: z.date().openapi({
      example: "2024-03-08T12:00:00Z",
      description: "Timestamp when the user was created",
    }),
  })
  .openapi("User");

export const CreateUserSchema = z
  .object({
    name: z.string().min(1).max(255).openapi({
      example: "John Doe",
      description: "User's full name",
    }),
    email: z.string().email().openapi({
      example: "johndoe@example.com",
      description: "User's email address",
    }),
    password: z.string().min(8).openapi({
      example: "strongpassword",
      description: "User's password (min 8 characters)",
    }),
  })
  .openapi("CreateUser");

export const SignInUserSchema = CreateUserSchema.pick({
  email: true,
  password: true,
}).openapi("LoginUser");

export const generateUserResponseSchema = (
  dataSchema: z.ZodObject<any>,
  message: string,
) => {
  return z
    .object({
      message: z.string().openapi({ example: message }),
      data: dataSchema,
      token: z.string().openapi({
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ...",
        description: "JWT token for the user",
      }),
    })
    .openapi("Token");
};
