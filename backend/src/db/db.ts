import { drizzle } from "drizzle-orm/node-postgres";
import * as noteSchema from "./schemas/note";
import * as userSchema from "./schemas/user";
import * as sessionSchema from "./schemas/session";

const db = drizzle(Bun.env.DB_URL!, {
  schema: { ...noteSchema, ...userSchema, ...sessionSchema },
});

export default db;
