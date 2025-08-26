import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

// Get the database URL from environment variables
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Parse the database URL to extract connection details
const url = new URL(databaseUrl);
const connectionConfig = {
  host: url.hostname,
  port: url.port ? parseInt(url.port) : 3306,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1), // Remove leading slash
  ssl: {
    rejectUnauthorized: false // Required for many shared hosting providers
  },
  connectTimeout: 60000,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Create MySQL connection pool
const pool = mysql.createPool({
  ...connectionConfig,
  waitForConnections: true,
  connectionLimit: 5, // Reduced for shared hosting
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000
});

// Create Drizzle instance
export const db = drizzle(pool);

export { pool as mysql };