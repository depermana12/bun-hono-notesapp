import db from "../db/db";
import { sessions } from "../db/schemas/session";

type Session = typeof sessions.$inferInsert;

class SessionRepository {
  public async storeSession(session: Session) {
    const rows = await db.insert(sessions).values(session).returning();
    return rows[0];
  }
}

export default SessionRepository;
