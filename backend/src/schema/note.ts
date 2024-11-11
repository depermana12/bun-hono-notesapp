import { z } from "zod";

export const NoteSchema = z.object({
  id: z.number().positive(),
  userId: z.number().positive(),
  title: z.string().min(1).max(255),
  content: z.string(),
  created_at: z.date(),
  updated_at: z.date().nullable(),
});

export const CreateNoteSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string(),
});

export const UpdateNoteSchema = z.object({
  id: z.number().positive(),
  title: z.string().min(1).max(255),
  content: z.string(),
});

export const DeleteNoteScema = z.object({
  id: z.number().positive(),
  userId: z.number().positive(),
  title: z.string().min(1).max(255),
});

export const PaginatedNotes = z.object({
  notes: z.array(NoteSchema),
  totalNotes: z.number().positive(),
  totalPages: z.number().positive(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});

export const generateNoteResponseSchema = (dataSchema: z.ZodObject<any>) => {
  return z.object({
    message: z.string(),
    data: dataSchema,
  });
};
