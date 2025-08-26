import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const connectionConfig = {
  host: 'sparsindia.com',
  port: 3306,
  user: 'sparsind_ydf',
  password: 'Vishwanath!@3',
  database: 'sparsind_ydf_ngo',
  ssl: {
    rejectUnauthorized: false
  },
  connectTimeout: 60000,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  charset: 'utf8mb4'
};

// Create MySQL connection pool
const pool = mysql.createPool({
  ...connectionConfig,
  waitForConnections: true,
  connectionLimit: 3,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  idleTimeout: 300000,
  maxIdle: 3
});

// Create Drizzle instance
export const db = drizzle(pool);
export { pool as mysql };

// Test connection function
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT VERSION() as version, NOW() as current_time, 1 as test');
    connection.release();
    console.log('✅ Database connection test successful');
    return { success: true, data: rows };
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}