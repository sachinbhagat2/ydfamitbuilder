// Load environment variables first
import { config } from 'dotenv';
config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeDatabase, testConnection, createDefaultUsers, mockDatabase } from './config/database';
import { handleDemo } from './routes/demo';
import testRoutes from './routes/test';
import authRoutes from './routes/auth';
import scholarshipRoutes from './routes/scholarships';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:8080',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const staticPath = path.join(__dirname, '../spa');
  app.use(express.static(staticPath));
}

// Add request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// API routes
app.get('/api/demo', handleDemo);
app.get('/api/ping', (req, res) => {
  res.json({ 
    success: true,
    message: 'Server is running', 
    timestamp: new Date().toISOString() 
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/test', testRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Youth Dreamers Foundation API is running',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/demo',
      '/api/ping', 
      '/api/test/connection',
      '/api/auth/login',
      '/api/auth/register',
      '/health'
    ]
  });
});

// API 404 handler - must come before the catch-all
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false,
    error: `API endpoint not found: ${req.path}`,
    availableEndpoints: [
      '/api/demo',
      '/api/ping',
      '/api/test/connection',
      '/api/auth/login',
      '/api/auth/register',
      '/api/scholarships'
    ]
  });
});

// Serve React app for all non-API routes
app.get('*', (req, res) => {
  // In development, let Vite handle the routing
  if (process.env.NODE_ENV === 'production') {
    const staticPath = path.join(__dirname, '../spa');
    res.sendFile(path.join(staticPath, 'index.html'));
  } else {
    // In development, don't handle frontend routes - let Vite proxy handle them
    res.status(404).json({ 
      success: false,
      error: 'Frontend route - should be handled by Vite dev server',
      message: 'This route should be accessed through the Vite dev server on port 5173',
      path: req.path,
      method: req.method
    });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Initialize database and start server
async function startServer() {
  try {
    console.log('🚀 Starting Youth Dreamers Foundation Server...');
    
    // Test database connection first
    const connectionTest = await testConnection();
    if (!connectionTest.success) {
      console.warn('⚠️ Database connection failed, using mock database:', connectionTest.error);
    }
    
    // Initialize database tables
    const dbInit = await initializeDatabase();
    if (!dbInit.success) {
      console.warn('⚠️ Database initialization failed, using mock database:', dbInit.error);
    }
    
    // Create default users
    await createDefaultUsers();

    // Detect and log egress IP for DB allowlisting
    try {
      const resp = await fetch('https://api.ipify.org?format=json');
      const data = await resp.json();
      if (data && data.ip) {
        console.log(`🌐 Server egress IP: ${data.ip}`);
        console.log('   Allowlist this IP in your MySQL host firewall');
      }
    } catch (e) {
      console.warn('⚠️ Could not detect egress IP automatically. Use /api/test/egress-ip endpoint.');
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Youth Dreamers Foundation Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API demo: http://localhost:${PORT}/api/demo`);
      console.log(`🔗 API ping: http://localhost:${PORT}/api/ping`);
      console.log(`🔗 Database test: http://localhost:${PORT}/api/test/connection`);
      console.log('');
      console.log('🔐 Default Login Credentials:');
      console.log('   Student: student@ydf.org / Student123!');
      console.log('   Admin: admin@ydf.org / Admin123!');
      console.log('   Reviewer: reviewer@ydf.org / Reviewer123!');
      console.log('   Donor: donor@ydf.org / Donor123!');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export function createServer() {
  return app;
}
