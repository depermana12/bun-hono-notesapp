import { z } from "zod";

export const ParamSchema = z.object({
  id: z.string(),
});

export const TokenSchema = z.object({
  token: z.string(),
});

export const querySchema = z.object({
  page: z.number().positive().optional(),
  limit: z.number().positive().optional(),
});
