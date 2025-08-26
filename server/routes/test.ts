import { Router } from 'express';
import { testConnection, initializeDatabase, createDefaultUsers } from '../config/database';

const router = Router();

// Manual database setup endpoint
router.post('/setup-database', async (req, res) => {
  try {
    console.log('🔄 Manual database setup initiated...');
    
    // Test connection first
    const connectionTest = await testConnection();
    if (!connectionTest.success) {
      return res.status(500).json({
        success: false,
        error: 'Database connection failed',
        details: connectionTest.error
      });
    }

    // Initialize database tables
    const dbInit = await initializeDatabase();
    if (!dbInit.success) {
      return res.status(500).json({
        success: false,
        error: 'Database initialization failed',
        details: dbInit.error
      });
    }

    // Create default users
    const usersResult = await createDefaultUsers();
    if (!usersResult.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to create default users',
        details: usersResult.error
      });
    }

    res.json({
      success: true,
      message: 'Database setup completed successfully',
      steps: [
        'Database connection verified',
        'All tables created',
        'Default users created'
      ],
      credentials: [
        { role: 'Student', email: 'student@ydf.org', password: 'Student123!' },
        { role: 'Admin', email: 'admin@ydf.org', password: 'Admin123!' },
        { role: 'Reviewer', email: 'reviewer@ydf.org', password: 'Reviewer123!' },
        { role: 'Donor', email: 'donor@ydf.org', password: 'Donor123!' }
      ]
    });
  } catch (error) {
    console.error('Manual database setup error:', error);
    res.status(500).json({
      success: false,
      error: 'Database setup failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Check if tables exist
router.get('/check-tables', async (req, res) => {
  try {
    const { mysql } = await import('../config/database');
    const connection = await mysql.getConnection();
    
    // Get list of tables
    const [tables] = await connection.execute('SHOW TABLES');
    
    // Get table details
    const tableDetails = [];
    for (const table of tables as any[]) {
      const tableName = Object.values(table)[0] as string;
      const [columns] = await connection.execute(`DESCRIBE ${tableName}`);
      const [count] = await connection.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
      
      tableDetails.push({
        name: tableName,
        columns: (columns as any[]).length,
        records: (count as any[])[0].count
      });
    }
    
    connection.release();
    
    res.json({
      success: true,
      database: 'sparsind_ydf_ngo',
      host: 'sparsindia.com',
      tablesCount: tables.length,
      tables: tableDetails
    });
  } catch (error) {
    console.error('Check tables error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check tables',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Comprehensive API and database test endpoint
router.get('/connection', async (req, res) => {
  const testResults = {
    timestamp: new Date().toISOString(),
    server: {
      status: 'running',
      port: process.env.PORT || 3000,
      environment: process.env.NODE_ENV || 'development'
    },
    database: {
      host: 'sparsindia.com',
      database: 'sparsind_ydf_ngo',
      user: 'sparsind_ydf',
      status: 'unknown',
      version: null,
      connectionTime: null,
      error: null
    },
    api: {
      status: 'working',
      endpoints: [
        '/api/test/connection',
        '/api/test/ping',
        '/api/demo',
        '/health'
      ]
    }
  };

  // Test database connection
  try {
    const startTime = Date.now();
    const dbResult = await testConnection();
    const connectionTime = Date.now() - startTime;

    testResults.database.status = 'connected';
    testResults.database.connectionTime = `${connectionTime}ms`;
    
    if (dbResult.data && Array.isArray(dbResult.data) && dbResult.data.length > 0) {
      testResults.database.version = dbResult.data[0].version || 'Unknown';
    }

    res.json({
      success: true,
      message: 'All systems operational',
      results: testResults
    });

  } catch (error) {
    testResults.database.status = 'failed';
    testResults.database.error = error instanceof Error ? error.message : 'Unknown error';

    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      results: testResults,
      troubleshooting: {
        possibleCauses: [
          'Database server is down',
          'Incorrect credentials',
          'Network connectivity issues',
          'Firewall blocking connection',
          'SSL/TLS configuration issues'
        ],
        nextSteps: [
          'Verify database credentials',
          'Check if sparsindia.com is accessible',
          'Ensure MySQL service is running',
          'Check firewall settings'
        ]
      }
    });
  }
});

// Simple ping test
router.get('/ping', (req, res) => {
  res.json({
    success: true,
    message: 'API is responding',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Environment check
router.get('/env', (req, res) => {
  res.json({
    success: true,
    environment: {
      nodeEnv: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 3000,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasJwtSecret: !!process.env.JWT_SECRET,
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
    }
  });
});

export default router;