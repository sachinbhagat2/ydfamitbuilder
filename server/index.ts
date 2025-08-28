// Load environment variables first
import { config } from "dotenv";
config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import {
  initializeDatabase,
  testConnection,
  createDefaultUsers,
  mockDatabase,
} from "./config/database";
import { handleDemo } from "./routes/demo";
import testRoutes from "./routes/test";
import authRoutes from "./routes/auth";
import scholarshipRoutes from "./routes/scholarships";
import surveysRoutes from "./routes/surveys";
import createDefaultScholarships from "./config/seed-scholarships";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost:8080",
      "http://localhost:3000",
    ],
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(__dirname, "../spa");
  app.use(express.static(staticPath));
}

// Add request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// API routes
app.get("/api/demo", handleDemo);
app.get("/api/ping", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/scholarships", scholarshipRoutes);
app.use("/api/test", testRoutes);
app.use("/api/surveys", surveysRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Youth Dreamers Foundation API is running",
    timestamp: new Date().toISOString(),
    endpoints: [
      "/api/demo",
      "/api/ping",
      "/api/test/connection",
      "/api/auth/login",
      "/api/auth/register",
      "/health",
    ],
  });
});

// API 404 handler - must come before the catch-all
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    error: `API endpoint not found: ${req.path}`,
    availableEndpoints: [
      "/api/demo",
      "/api/ping",
      "/api/test/connection",
      "/api/auth/login",
      "/api/auth/register",
      "/api/scholarships",
    ],
  });
});

// Serve React app for all non-API routes
app.get("*", (req, res) => {
  // In development, let Vite handle the routing
  if (process.env.NODE_ENV === "production") {
    const staticPath = path.join(__dirname, "../spa");
    res.sendFile(path.join(staticPath, "index.html"));
  } else {
    // In development, redirect to Vite dev server or serve a simple message
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({
        success: false,
        error: "API endpoint not found",
        path: req.path,
      });
    }
    
    // For non-API routes in development, provide helpful information
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Youth Dreamers Foundation - Development</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .logo { text-align: center; margin-bottom: 30px; }
            .logo img { height: 60px; }
            h1 { color: #0057A3; text-align: center; }
            .info { background: #e3f2fd; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .button { display: inline-block; background: #0057A3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
            .button:hover { background: #004080; }
            .status { color: #4caf50; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <img src="https://cdn.builder.io/api/v1/image/assets%2F3b1b952ac06b422687ab6f8265e647a7%2F209099442e6c42e883b3d324b2f06354?format=webp&width=800" alt="Youth Dreamers Foundation" />
            </div>
            <h1>Youth Dreamers Foundation</h1>
            <div class="info">
              <p><span class="status">✅ Backend Server Running</span> - Port 3000</p>
              <p>For the full application experience, please access:</p>
              <p><strong>Frontend Development Server:</strong></p>
              <a href="http://localhost:5173" class="button">Open Application (Port 5173)</a>
            </div>
            <div class="info">
              <p><strong>Available API Endpoints:</strong></p>
              <ul>
                <li><a href="/api/ping">/api/ping</a> - Server status</li>
                <li><a href="/api/demo">/api/demo</a> - Demo endpoint</li>
                <li><a href="/api/test/connection">/api/test/connection</a> - Database test</li>
                <li><a href="/health">/health</a> - Health check</li>
              </ul>
            </div>
            <p style="text-align: center; color: #666; margin-top: 30px;">
              <small>Development Mode - Backend Server</small>
            </p>
          </div>
        </body>
      </html>
    `);
  }
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  },
);

// Initialize database and start server
async function startServer() {
  try {
    console.log("🚀 Starting Youth Dreamers Foundation Server...");

    // Test database connection first
    const connectionTest = await testConnection();
    if (!connectionTest.success) {
      console.warn(
        "⚠️ Database connection failed, using mock database:",
        connectionTest.error,
      );
    }

    // Initialize database tables
    const dbInit = await initializeDatabase();
    if (!dbInit.success) {
      console.warn(
        "⚠️ Database initialization failed, using mock database:",
        dbInit.error,
      );
    }

    // Create default users
    await createDefaultUsers();

    // Seed default scholarships into DB (no-op for mock)
    await createDefaultScholarships();

    // Detect and log egress IP for DB allowlisting
    try {
      const resp = await fetch("https://api.ipify.org?format=json");
      const data = await resp.json();
      if (data && data.ip) {
        console.log(`🌐 Server egress IP: ${data.ip}`);
        console.log("   Allowlist this IP in your MySQL host firewall");
      }
    } catch (e) {
      console.warn(
        "⚠️ Could not detect egress IP automatically. Use /api/test/egress-ip endpoint.",
      );
    }

    // Start server
    app.listen(PORT, () => {
      console.log(
        `🚀 Youth Dreamers Foundation Server running on port ${PORT}`,
      );
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API demo: http://localhost:${PORT}/api/demo`);
      console.log(`🔗 API ping: http://localhost:${PORT}/api/ping`);
      console.log(
        `🔗 Database test: http://localhost:${PORT}/api/test/connection`,
      );
      console.log("");
      console.log("🔐 Default Login Credentials:");
      console.log("   Student: student@ydf.org / Student123!");
      console.log("   Admin: admin@ydf.org / Admin123!");
      console.log("   Reviewer: reviewer@ydf.org / Reviewer123!");
      console.log("   Donor: donor@ydf.org / Donor123!");
      console.log("   Surveyor: surveyor@ydf.org / Surveyor123!");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

if (
  !process.env.NETLIFY &&
  !process.env.VERCEL &&
  !process.env.AWS_LAMBDA_FUNCTION_NAME &&
  process.env.NODE_ENV !== "test"
) {
  startServer();
}

export function createServer() {
  return app;
}
