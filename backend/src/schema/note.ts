import { z } from "@hono/zod-openapi";

export const NoteSchema = z
  .object({
    id: z.number().positive().openapi({
      example: 1,
      description: "Unique identifier for the note",
    }),
    userId: z.number().positive().openapi({
      example: 1,
      description: "ID of the user who owns this note",
    }),
    title: z.string().min(1).max(255).openapi({
      example: "Meeting Notes",
      description: "Title of the note",
    }),
    content: z.string().openapi({
      example: "Discussed project timeline and deliverables...",
      description: "Content of the note",
    }),
    created_at: z.date().openapi({
      example: "2024-03-08T12:00:00Z",
      description: "Timestamp when the note was created",
    }),
    updated_at: z.date().nullable().openapi({
      example: "2024-03-08T14:30:00Z",
      description: "Timestamp when the note was last updated",
    }),
  })
  .openapi("Note");

export const CreateNoteSchema = z
  .object({
    title: z.string().min(1).max(255).openapi({
      example: "Meeting Notes",
      description: "Title of the note",
    }),
    content: z.string().openapi({
      example: "Discussed project timeline and deliverables...",
      description: "Content of the note",
    }),
  })
  .openapi("CreateNote");

export const UpdateNoteSchema = CreateNoteSchema.openapi("UpdateNote");

export const DeleteNoteScema = z.object({
  id: z.number().positive().openapi({
    example: 1,
    description: "Unique identifier for the note",
  }),
  userId: z.number().positive().openapi({
    example: 1,
    description: "ID of the user who owns this note",
  }),
  title: z.string().min(1).max(255).openapi({
    example: "Meeting Notes",
    description: "Title of the note",
  }),
});

export const paginatedNotes = z.object({
  notes: z.array(NoteSchema),
  totalNotes: z.number().positive().openapi({
    example: 10,
    description: "Total number of notes",
  }),
  totalPages: z.number().positive().openapi({
    example: 2,
    description: "Current page number",
  }),
  hasNext: z.boolean().openapi({
    example: true,
    description: "Flag indicating if there are more pages",
  }),
  hasPrev: z.boolean().openapi({
    example: false,
    description: "Flag indicating if there are previous pages",
  }),
});

export const generateNoteResponseSchema = (
  dataSchema: z.ZodObject<any>,
  message: string,
) => {
  return z.object({
    message: z.string().openapi({ example: message }),
    data: dataSchema,
  });
};
