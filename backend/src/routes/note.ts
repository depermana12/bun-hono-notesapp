import { Hono } from "hono";
import NoteService from "../services/note";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { JwtVariables } from "hono/jwt";
import { HTTPException } from "hono/http-exception";

type JwtPayload = {
  userId: number;
  exp: number;
};
type Variables = JwtVariables<JwtPayload>;

const noteSchema = z.object({
  title: z.string().min(3, { message: "Must be 3 or more characters long" }),
  content: z.string().min(3, { message: "Must be 3 or more characters long" }),
});

const noteService = new NoteService();
const note = new Hono<{ Variables: Variables }>();

note
  .post(
    "/",
    zValidator("json", noteSchema, (result, c) => {
      if (!result.success) {
        throw new HTTPException(400, {
          message: result.error.issues[0].message,
        });
      }
    }),
    async (c) => {
      const validatedNote = c.req.valid("json");
      const { userId } = c.get("jwtPayload");
      const note = await noteService.createNote(validatedNote, userId);
      return c.json({ message: "note created", data: note }, 201);
    },
  )
  .get(async (c) => {
    const { userId } = c.get("jwtPayload");
    const notes = await noteService.getNotes(userId);
    return c.json(
      {
        message: "all notes",
        data: notes,
      },
      200,
    );
  });

note
  .get("/:id", async (c) => {
    const noteId = c.req.param("id");
    const { userId } = c.get("jwtPayload");
    const note = await noteService.getNote(Number(noteId), userId);
    return c.json(
      {
        message: "success get note",
        data: note,
      },
      200,
    );
  })
  .patch(
    zValidator("json", noteSchema, (result, c) => {
      if (!result.success) {
        throw new HTTPException(400, {
          message: result.error.issues[0].message,
        });
      }
    }),
    async (c) => {
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
    },
  )
  .delete(async (c) => {
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
