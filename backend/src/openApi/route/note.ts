import { createRoute } from "@hono/zod-openapi";
import { ErrorSchema } from "../../schema/error";
import { ParamSchema, querySchema } from "../../schema/queryParam";
import * as S from "../../schema/note";

export const createNoteRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["note"],
  security: [{ Bearer: [] }],
  description: "create a new note",
  request: {
    body: {
      content: {
        "application/json": {
          schema: S.CreateNoteSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "note created successfully",
      content: {
        "application/json": {
          schema: S.generateNoteResponseSchema(S.NoteSchema, "note created"),
        },
      },
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

export const getNoteRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["note"],
  security: [{ Bearer: [] }],
  description: "get a note",
  request: {
    params: ParamSchema,
  },
  responses: {
    200: {
      description: "successfully get a note by id",
      content: {
        "application/json": {
          schema: S.generateNoteResponseSchema(
            S.NoteSchema,
            "success get a note",
          ),
        },
      },
    },
    400: {
      description: "failed to retrieve note",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});

export const getPaginatedNoteRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["note"],
  security: [{ Bearer: [] }],
  description: "get all notes paginated",
  request: {
    query: querySchema,
  },
  responses: {
    200: {
      description: "successfully get all notes",
      content: {
        "application/json": {
          schema: S.generateNoteResponseSchema(S.paginatedNotes, "all notes"),
        },
      },
    },
    400: {
      description: "failed to retrieve notes",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});

export const updateNoteRoute = createRoute({
  method: "patch",
  path: "/{id}",
  tags: ["note"],
  security: [{ Bearer: [] }],
  description: "update an existing note",
  request: {
    params: ParamSchema,
    body: {
      content: {
        "application/json": {
          schema: S.UpdateNoteSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Succesfully update note",
      content: {
        "application/json": {
          schema: S.generateNoteResponseSchema(S.NoteSchema, "note updated"),
        },
      },
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

export const deleteNoteRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["note"],
  security: [{ Bearer: [] }],
  description: "delete an existing note",
  request: {
    params: ParamSchema,
  },
  responses: {
    204: {
      description: "successfully delete note",
      content: {
        "application/json": {
          schema: S.generateNoteResponseSchema(
            S.DeleteNoteScema,
            "note deleted",
          ),
        },
      },
    },
    400: {
      description: "failed to delete note",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});
