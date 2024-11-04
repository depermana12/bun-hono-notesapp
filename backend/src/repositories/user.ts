import { eq } from "drizzle-orm";
import db from "../db/db";
import { users } from "../db/schema";

type NewUserData = {
  name: string;
  email: string;
  password: string;
};
type User = typeof users.$inferInsert & { id: number };
type SafeUser = Omit<User, "password">;

class UserRepository {
  public async addUser(userData: NewUserData): Promise<SafeUser> {
    try {
      const rows = await db.insert(users).values(userData).returning({
        id: users.id,
        name: users.name,
        email: users.email,
        created_at: users.createdAt,
      });
      return rows[0];
    } catch (error) {
      //TODO throw to global error handler
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
  public findById(userId: number) {
    return db.select().from(users).where(eq(users.id, userId));
  }
  public async findByEmail(userEmail: string): Promise<User | null> {
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
