// Load environment variables first
import { config } from 'dotenv';
config();

import express from 'express';
import cors from 'cors';
// Import routes
import { handleDemo } from './routes/demo';
import testRoutes from './routes/test';

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
app.use('/api/auth', require('./routes/auth').default);
app.use('/api/scholarships', require('./routes/scholarships').default);
app.use('/api/test', testRoutes);
app.get('/api/ping', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date().toISOString() });
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

