// Load environment variables first
import { config } from 'dotenv';
config();

import express from 'express';
import cors from 'cors';
// Import routes
import { handleDemo } from './routes/demo';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic API routes
app.get('/api/demo', handleDemo);
app.get('/api/ping', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date().toISOString() });
});

// Database connection test endpoint
app.get('/api/db-test', async (req, res) => {
  try {
    // Import database connection
    const { db } = await import('./config/database.js');
    
    // Test query - get database version
    const result = await db.execute('SELECT VERSION() as version, NOW() as current_time');
    
    res.json({
      success: true,
      message: 'Database connection successful',
      data: {
        server: 'sparsindia.com',
        database: 'sparsind_ydf_ngo',
        version: result[0]?.version || 'Unknown',
        currentTime: result[0]?.current_time || new Date(),
        connectionStatus: 'Connected'
      }
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    res.status(500).json({
      success: false,
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      server: 'sparsindia.com',
      database: 'sparsind_ydf_ngo'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Youth Dreamers Foundation API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API endpoints: http://localhost:${PORT}/api`);
});

