import { Hono } from "hono";
import NoteService from "../services/note";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { JwtVariables } from "hono/jwt";

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

note.post(
  "/",
  zValidator("json", noteSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        { message: "invalid data", errors: result.error.issues[0].message },
        400,
      );
    }
  }),
  async (c) => {
    const validatedNote = c.req.valid("json");
    const { userId } = c.get("jwtPayload");
    const note = await noteService.createNote(validatedNote, userId);
    return c.json({ message: "note created", data: note }, 201);
  },
);

export default note;
