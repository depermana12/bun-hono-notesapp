import { eq } from "drizzle-orm";
import db from "../db/db";
import { users } from "../db/schema";

type NewUserData = {
  name: string;
  email: string;
  password: string;
};
type User = typeof users.$inferInsert;
type SafeUser = Omit<User, "password">;

class UserRepository {
  public async addUser(userData: NewUserData): Promise<SafeUser> {
    try {
      const rows = await db.insert(users).values(userData).returning();
      return rows[0];
    } catch (error) {
      //TODO throw to global error handler
      throw new Error(
        error instanceof Error ? "error add new user" : String(error),
      );
    }
  }
  public findById(userId: number) {
    return db.select().from(users).where(eq(users.id, userId));
  }
  public async findByEmail(userEmail: string): Promise<SafeUser | null> {
    try {
      const rows = await db
        .select()
        .from(users)
        .where(eq(users.email, userEmail));
      return rows[0] || null;
    } catch (error) {
      throw new Error(
        error instanceof Error ? "error email not found" : String(error),
      );
    }
  }
}

export default UserRepository;
