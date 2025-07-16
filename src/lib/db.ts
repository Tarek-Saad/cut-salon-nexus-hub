import { Pool } from "pg";

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_j0cReGDu8TNX@ep-red-paper-ae01fnqr-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  ssl: {
    rejectUnauthorized: false,
  },
});

export { pool };
