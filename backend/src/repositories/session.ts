import { eq } from "drizzle-orm";
import db from "../db/db";
import { sessions } from "../db/schemas/session";

type Session = typeof sessions.$inferInsert;

class SessionRepository {
  public async storeSession(session: Session) {
    const rows = await db.insert(sessions).values(session).returning();
    return rows[0];
  }
  public async updateSession(id: number, session: Partial<Session>) {
    const rows = await db
      .update(sessions)
      .set(session)
      .where(eq(sessions.userId, id))
      .returning();
    return rows[0];
  }
}

export default SessionRepository;
