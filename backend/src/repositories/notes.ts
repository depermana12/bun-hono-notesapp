import { eq, and } from "drizzle-orm";
import db from "../db/db";
import { notes } from "../db/schema";

type Note = typeof notes.$inferSelect;
type NewNote = typeof notes.$inferInsert;

class NoteRepository {
  public async create(noteData: NewNote): Promise<Note> {
    try {
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
  public async findAll(): Promise<Note[]> {
    try {
      const rows = await db.select().from(notes);
      return rows;
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
}

export default NoteRepository;
