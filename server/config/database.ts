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

// Initialize database tables
export async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        user_type VARCHAR(20) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        email_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        profile_data JSON
      )
    `);

    // Create scholarships table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS scholarships (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'INR',
        eligibility_criteria JSON NOT NULL,
        required_documents JSON NOT NULL,
        application_deadline TIMESTAMP NOT NULL,
        selection_deadline TIMESTAMP,
        max_applications INT,
        current_applications INT DEFAULT 0,
        status VARCHAR(20) DEFAULT 'active',
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        tags JSON
      )
    `);

    // Create applications table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        scholarship_id INT NOT NULL,
        status VARCHAR(20) DEFAULT 'submitted',
        application_data JSON NOT NULL,
        documents JSON,
        score DECIMAL(5,2),
        review_notes TEXT,
        reviewed_by INT,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reviewed_at TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    connection.release();
    console.log('✅ Database tables initialized successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

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