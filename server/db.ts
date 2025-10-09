import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const connectionString = process.env.DATABASE_URL;
const isLocalConnection =
  connectionString.includes("localhost") || connectionString.includes("127.0.0.1");

export const pool = new Pool({
  connectionString,
  ...(isLocalConnection ? {} : { ssl: { rejectUnauthorized: false } }),
});
export const db = drizzle({ client: pool, schema });
