import { z } from "@hono/zod-openapi";

export const paramSchema = z.object({
  id: z
    .string()
    .min(3)
    .openapi({
      param: {
        name: "id",
        in: "path",
      },
      example: "1212121",
    }),
});

export const querySchema = z.object({
  page: z
    .number()
    .positive()
    .optional()
    .openapi({
      param: {
        name: "page",
        in: "query",
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
      },
      example: 10,
    }),
});
