import { eq, and, desc, count } from "drizzle-orm";
import db from "../db/db";
import { notes } from "../db/schema";
import { countAsInt } from "../db/utils";

type Note = typeof notes.$inferSelect;
type NoteInsert = typeof notes.$inferInsert;
type NewNote = Omit<NoteInsert, "userId">;
class NoteRepository {
  public async create(newNote: NewNote, userId: number): Promise<Note> {
    try {
      const noteData = { ...newNote, userId };
      const rows = await db.insert(notes).values(noteData).returning();
      return rows[0];
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  public async findById(noteId: number, userId: number): Promise<Note | null> {
    try {
      const rows = await db
        .select()
        .from(notes)
        .where(and(eq(notes.id, noteId), eq(notes.userId, userId)));
      return rows[0] || null;
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
  public async findNotes(userId: number, limit: number, offset: number) {
    try {
      const rows = await db
        .select()
        .from(notes)
        .where(eq(notes.userId, userId))
        .orderBy(desc(notes.created_at))
        .limit(limit)
        .offset(offset);
      return rows;
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
  public async countNotes(userId: number): Promise<number> {
    try {
      const totalNote = await db
        .select({ count: countAsInt() })
        .from(notes)
        .where(eq(notes.userId, userId));
      return totalNote[0].count;
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
  public async update(
    noteId: number,
    title: string,
    content: string,
    userId: number,
  ) {
    try {
      const rows = await db
        .update(notes)
        .set({ title, content, updated_at: new Date() })
        .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
        .returning();
      return rows[0];
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : String(error));
      // drizzle not have support for error instance yet
    }
  }

  public async delete(noteId: number, userId: number) {
    try {
      const rows = await db
        .delete(notes)
        .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
        .returning({ id: notes.id, userId: notes.userId, title: notes.title });
      return rows[0];
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
}

export default NoteRepository;
