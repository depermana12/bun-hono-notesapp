import { drizzle } from "drizzle-orm/node-postgres";
import * as dbSchema from "./schema";

const db = drizzle("postgres://hononotes:hononotes@db:5432/hononotes", {
  schema: dbSchema,
});

export default db;
