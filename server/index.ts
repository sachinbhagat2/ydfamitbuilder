// Load environment variables first
import { config } from 'dotenv';
config();

import express from 'express';
import cors from 'cors';
import { handleDemo } from './routes/demo';
import testRoutes from './routes/test';
import authRoutes from './routes/auth';
import scholarshipRoutes from './routes/scholarships';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API endpoint not found: ${req.path}`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API demo: http://localhost:${PORT}/api/demo`);
  console.log(`🔗 API ping: http://localhost:${PORT}/api/ping`);
});

export function createServer() {
  return app;
}