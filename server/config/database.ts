import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Get the database URL from environment variables
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create Neon connection
const sql = neon(databaseUrl);

// Create Drizzle instance
export const db = drizzle(sql);

export { sql };
