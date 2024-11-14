import { eq } from "drizzle-orm";
import db from "../db/db";
import { users } from "../db/schemas/user";

type User = typeof users.$inferSelect;
type AddUser = typeof users.$inferInsert;
type AddUserResponse = Omit<User, "password">;

class UserRepository {
  public async addUser(userData: AddUser): Promise<AddUserResponse> {
    try {
      const rows = await db.insert(users).values(userData).returning();
      const { password, ...newUser } = rows[0];
      return newUser;
    } catch (error) {
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
      return rows[0];
    } catch (error) {
      throw new Error(
        error instanceof Error ? "error email not found" : String(error),
      );
    }
  }

  public async updateUser(
    userId: number,
    userData: Partial<User>,
  ): Promise<AddUserResponse> {
    try {
      const rows = await db
        .update(users)
        .set(userData)
        .where(eq(users.id, userId))
        .returning();
      return rows[0];
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
}

export default UserRepository;
