import { Router } from 'express';
import { testConnection } from '../config/database';

const router = Router();

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