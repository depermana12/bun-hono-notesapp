import { z } from "@hono/zod-openapi";

export const ParamSchema = z.object({
  id: z.string().openapi({
    param: {
      name: "id",
      in: "path",
      description: "unique number as identifier for the note",
    },
    example: "4",
  }),
});

export const TokenSchema = z
  .object({
    token: z.string().openapi({
      param: {
        name: "token",
        in: "path",
        description: "short-lived token for resetting password",
      },
      example: "IjoiYXV0aCIsImV4cCI6MTYyNj...",
    }),
  })
  .openapi("TokenResponse");

export const querySchema = z
  .object({
    page: z
      .number()
      .positive()
      .optional()
      .openapi({
        param: {
          name: "page",
          in: "query",
          description: "Page number for pagination",
        },
        example: 1,
      }),
    limit: z
      .number()
      .positive()
      .optional()
      .openapi({
        param: {
          name: "limit",
          in: "query",
          description: "Number of notes per page",
        },
        example: 10,
      }),
  })
  .openapi("Query");
