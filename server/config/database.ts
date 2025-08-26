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
  charset: 'utf8mb4',
  multipleStatements: true
};

// Create MySQL connection pool
const pool = mysql.createPool({
  ...connectionConfig,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  idleTimeout: 300000,
  maxIdle: 5
});

// Create Drizzle instance
export const db = drizzle(pool);
export { pool as mysql };

// Initialize database tables with proper SQL
export async function initializeDatabase() {
  try {
    console.log('🔄 Connecting to MySQL database...');
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database');
    
    // Create users table
    console.log('📋 Creating users table...');
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
        profile_data JSON,
        INDEX idx_email (email),
        INDEX idx_user_type (user_type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create scholarships table
    console.log('📋 Creating scholarships table...');
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
        selection_deadline TIMESTAMP NULL,
        max_applications INT NULL,
        current_applications INT DEFAULT 0,
        status VARCHAR(20) DEFAULT 'active',
        created_by INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        tags JSON,
        INDEX idx_status (status),
        INDEX idx_deadline (application_deadline),
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create applications table
    console.log('📋 Creating applications table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        scholarship_id INT NOT NULL,
        status VARCHAR(20) DEFAULT 'submitted',
        application_data JSON NOT NULL,
        documents JSON,
        score DECIMAL(5,2) NULL,
        review_notes TEXT,
        reviewed_by INT NULL,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reviewed_at TIMESTAMP NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_student (student_id),
        INDEX idx_scholarship (scholarship_id),
        INDEX idx_status (status),
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (scholarship_id) REFERENCES scholarships(id) ON DELETE CASCADE,
        FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create reviews table
    console.log('📋 Creating reviews table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        application_id INT NOT NULL,
        reviewer_id INT NOT NULL,
        criteria JSON NOT NULL,
        overall_score DECIMAL(5,2) NOT NULL,
        comments TEXT,
        recommendation VARCHAR(30),
        is_complete BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_application (application_id),
        INDEX idx_reviewer (reviewer_id),
        FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
        FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create notifications table
    console.log('📋 Creating notifications table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(20) NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        related_id INT NULL,
        related_type VARCHAR(50) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user (user_id),
        INDEX idx_type (type),
        INDEX idx_read (is_read),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create documents table
    console.log('📋 Creating documents table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS documents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        application_id INT NULL,
        file_name VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        file_size INT NOT NULL,
        file_url TEXT NOT NULL,
        document_type VARCHAR(50) NOT NULL,
        is_verified BOOLEAN DEFAULT FALSE,
        verification_notes TEXT,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user (user_id),
        INDEX idx_application (application_id),
        INDEX idx_type (document_type),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create announcements table
    console.log('📋 Creating announcements table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS announcements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        type VARCHAR(20) DEFAULT 'general',
        target_audience JSON,
        is_active BOOLEAN DEFAULT TRUE,
        priority VARCHAR(10) DEFAULT 'normal',
        valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        valid_to TIMESTAMP NULL,
        created_by INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_active (is_active),
        INDEX idx_type (type),
        INDEX idx_priority (priority),
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create contributions table
    console.log('📋 Creating contributions table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS contributions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        donor_id INT NOT NULL,
        scholarship_id INT NULL,
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'INR',
        payment_method VARCHAR(50),
        payment_id VARCHAR(255),
        status VARCHAR(20) DEFAULT 'pending',
        contribution_type VARCHAR(20) DEFAULT 'one_time',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL,
        INDEX idx_donor (donor_id),
        INDEX idx_scholarship (scholarship_id),
        INDEX idx_status (status),
        FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (scholarship_id) REFERENCES scholarships(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create settings table
    console.log('📋 Creating settings table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        \`key\` VARCHAR(100) UNIQUE NOT NULL,
        value JSON NOT NULL,
        description TEXT,
        updated_by INT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_key (\`key\`),
        FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    connection.release();
    console.log('✅ All database tables created successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Create default users
export async function createDefaultUsers() {
  try {
    console.log('👥 Creating default users...');
    
    const defaultUsers = [
      {
        email: 'student@ydf.org',
        password: 'Student123!',
        firstName: 'Demo',
        lastName: 'Student',
        phone: '+91 9876543210',
        userType: 'student',
        profileData: { course: 'B.Tech Computer Science', college: 'Demo College' }
      },
      {
        email: 'admin@ydf.org',
        password: 'Admin123!',
        firstName: 'Demo',
        lastName: 'Admin',
        phone: '+91 9876543211',
        userType: 'admin',
        profileData: { department: 'Administration' }
      },
      {
        email: 'reviewer@ydf.org',
        password: 'Reviewer123!',
        firstName: 'Demo',
        lastName: 'Reviewer',
        phone: '+91 9876543212',
        userType: 'reviewer',
        profileData: { specialization: 'Academic Review' }
      },
      {
        email: 'donor@ydf.org',
        password: 'Donor123!',
        firstName: 'Demo',
        lastName: 'Donor',
        phone: '+91 9876543213',
        userType: 'donor',
        profileData: { organization: 'Demo Foundation' }
      }
    ];

    const connection = await pool.getConnection();
    
    for (const userData of defaultUsers) {
      // Check if user exists
      const [existingUsers] = await connection.execute(
        'SELECT id FROM users WHERE email = ?',
        [userData.email]
      );
      
      if ((existingUsers as any[]).length === 0) {
        // Hash password using bcrypt
        const bcrypt = await import('bcryptjs');
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        
        // Insert user
        await connection.execute(`
          INSERT INTO users (email, password, first_name, last_name, phone, user_type, profile_data, is_active, email_verified)
          VALUES (?, ?, ?, ?, ?, ?, ?, TRUE, TRUE)
        `, [
          userData.email,
          hashedPassword,
          userData.firstName,
          userData.lastName,
          userData.phone,
          userData.userType,
          JSON.stringify(userData.profileData)
        ]);
        
        console.log(`✅ Created user: ${userData.email}`);
      } else {
        console.log(`ℹ️  User already exists: ${userData.email}`);
      }
    }
    
    connection.release();
    console.log('✅ Default users setup completed');
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to create default users:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Test connection function
export async function testConnection() {
  try {
    console.log('🔄 Testing database connection...');
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT VERSION() as version, NOW() as current_time, DATABASE() as database_name');
    connection.release();
    console.log('✅ Database connection test successful');
    return { success: true, data: rows };
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}