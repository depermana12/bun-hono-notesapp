import NoteService from "../services/note";
import type { JwtVariables } from "hono/jwt";
import { OpenAPIHono } from "@hono/zod-openapi";
import * as r from "../openApi/route/note";

type JwtPayload = {
  userId: number;
  exp: number;
};
type Variables = JwtVariables<JwtPayload>;

const noteService = new NoteService();
const note = new OpenAPIHono<{ Variables: Variables }>();

note
  .openapi(r.createNoteRoute, async (c) => {
    const validatedNote = c.req.valid("json");
    const { userId } = c.get("jwtPayload");
    const note = await noteService.createNote(validatedNote, userId);
    return c.json({ message: "note created", data: note }, 201);
  })
  .openapi(r.getPaginatedNoteRoute, async (c) => {
    const { userId } = c.get("jwtPayload");
    const { page, limit } = c.req.valid("query");
    let pageNumber = Number(page) || 1;
    let notePerPage = Number(limit) || 10;

    const { notesList, totalNotes, totalPages, hasNext, hasPrev } =
      await noteService.getNotes(userId, pageNumber, notePerPage);
    return c.json(
      {
        message: "all notes",
        data: {
          paginated: {
            notes: notesList,
            totalNotes,
            totalPages,
            hasNext,
            hasPrev,
          },
        },
      },
      200,
    );
  });

note
  .openapi(r.getNoteRoute, async (c) => {
    const noteId = c.req.param("id");
    const { userId } = c.get("jwtPayload");
    const note = await noteService.getNote(Number(noteId), userId);
    return c.json(
      {
        message: "success get a note",
        data: note,
      },
      200,
    );
  })
  .openapi(r.updateNoteRoute, async (c) => {
    const { title, content } = c.req.valid("json");
    const id = c.req.param("id");
    const { userId } = c.get("jwtPayload");
    const noteUpdated = await noteService.updateNote(
      Number(id),
      title,
      content,
      userId,
    );

    return c.json(
      {
        message: "note updated",
        data: noteUpdated,
      },
      200,
    );
  })
  .openapi(r.deleteNoteRoute, async (c) => {
    const noteId = c.req.param("id");
    const { userId } = c.get("jwtPayload");
    const noteDeleted = await noteService.deleteNote(Number(noteId), userId);
    return c.json(
      {
        message: "note deleted",
        data: noteDeleted,
      },
      204,
    );
  });

export default note;
