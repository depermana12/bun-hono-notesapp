import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as dbSchema from "./schema";

const db = drizzle(process.env.DATABASE_URL!, { schema: dbSchema });

export default db;
