import { drizzle } from "drizzle-orm/node-postgres";
import * as dbSchema from "./schema";

const db = drizzle(Bun.env.DB_URL!, {
  schema: dbSchema,
});

export default db;
