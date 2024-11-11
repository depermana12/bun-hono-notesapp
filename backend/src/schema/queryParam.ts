import { z } from "zod";

export const ParamSchema = z.object({
  id: z.number().positive(),
});

export const TokenSchema = z.object({
  token: z.string(),
});

export const QuerySchema = z.object({
  page: z.number().positive().optional(),
  limit: z.number().positive().optional(),
});
