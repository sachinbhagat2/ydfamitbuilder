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
import applicationsRoutes from "./routes/applications";
import announcementsRoutes from "./routes/announcements";
import reviewerRoutes from "./routes/reviewer";
import rolesRoutes from "./routes/roles";
import createDefaultScholarships from "./config/seed-scholarships";

const IS_SERVERLESS = Boolean(
  process.env.NETLIFY ||
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME,
);

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

// Serve static files in production when not running in serverless
if (process.env.NODE_ENV === "production" && !IS_SERVERLESS) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const staticPath = path.join(__dirname, "../spa");
  console.log("📁 Serving static files from:", staticPath);
  
  // Ensure static path exists
  try {
    const fs = await import('fs');
    if (fs.existsSync(staticPath)) {
      console.log("✅ Static directory exists");
      app.use(express.static(staticPath, {
        maxAge: '1d',
        etag: true,
        lastModified: true,
        fallthrough: true
      }));
    } else {
      console.warn("⚠️ Static directory not found:", staticPath);
    }
  } catch (error) {
    console.error("❌ Error setting up static files:", error);
  }
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
app.use("/api/applications", applicationsRoutes);
app.use("/api/announcements", announcementsRoutes);
app.use("/api/reviewer", reviewerRoutes);
app.use("/api/roles", rolesRoutes);

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
      "/api/applications",
      "/api/applications/stats",
    ],
  });
});

// Serve React app for all non-API routes when not running in serverless
app.get("*", (req, res) => {
  console.log("📍 Fallback route hit:", req.path);
  
  if (process.env.NODE_ENV === "production" && !IS_SERVERLESS) {
    // Serve built SPA in production (non-serverless)
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const staticPath = path.join(__dirname, "../spa");
    const indexPath = path.join(staticPath, "index.html");
    
    try {
      const fs = require('fs');
      if (fs.existsSync(indexPath)) {
        console.log("✅ Serving index.html from:", indexPath);
        res.sendFile(indexPath, (err) => {
          if (err) {
            console.error("❌ Error sending file:", err);
            res.status(500).json({
              success: false,
              error: "Error serving frontend",
              message: "Failed to serve index.html",
              path: req.path,
            });
          }
        });
      } else {
        console.warn("⚠️ index.html not found at:", indexPath);
        res.status(404).json({
          success: false,
          error: "Frontend not built",
          message: "Application files not found. Rebuild required.",
          path: req.path,
        });
      }
    } catch (error) {
      console.error("❌ Error serving index.html:", error);
      res.status(500).json({
        success: false,
        error: "Error serving frontend",
        message: error.message,
        path: req.path,
      });
    }
  } else if (process.env.NODE_ENV === "development") {
    // Serve dev index.html locally
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const indexPath = path.join(__dirname, "../index.html");
    res.sendFile(indexPath);
  } else {
    // Serverless or invalid route in dev
    res.status(404).json({
      success: false,
      error: "Frontend route - should be handled by SPA host/dev server",
      message:
        "Access through Vite dev server (dev) or Netlify static host (prod)",
      path: req.path,
      method: req.method,
    });
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
    console.error("❌ Unhandled error:", {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      url: req.url,
      headers: req.headers,
      timestamp: new Date().toISOString(),
    });
    
    // Check if response was already sent
    if (res.headersSent) {
      return next(err);
    }
    
    res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === 'production' ? "Internal server error" : err.message,
      timestamp: new Date().toISOString(),
      path: req.path,
      ...(process.env.NODE_ENV !== 'production' && { 
        stack: err.stack,
        details: err 
      }),
    });
  },
);

// Initialize database and start server
async function startServer() {
  try {
    console.log("🚀 Starting Youth Dreamers Foundation Server...");

    // Test database connection first
    console.log("🔍 Environment check:");
    console.log("  NODE_ENV:", process.env.NODE_ENV);
    console.log("  DATABASE_URL exists:", !!process.env.DATABASE_URL);
    console.log("  REPLIT_DB_URL exists:", !!process.env.REPLIT_DB_URL);
    console.log("  REPL_ID exists:", !!process.env.REPL_ID);
    console.log("  PORT:", process.env.PORT);
    
    // Ensure proper database connection for production
    if (process.env.NODE_ENV === 'production') {
      // Wait a bit for Replit database to be ready
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    const connectionTest = await testConnection();
    if (!connectionTest.success) {
      console.error(
        "❌ Database connection failed:",
        connectionTest.error,
      );
      
      if (process.env.NODE_ENV === 'production') {
        console.log("🔄 Production: Retrying database connection...");
        // Retry once for production
        await new Promise(resolve => setTimeout(resolve, 3000));
        const retryTest = await testConnection();
        if (!retryTest.success) {
          console.error("❌ Production database retry failed, using fallback");
          process.env.USE_MOCK_DB = 'true';
        } else {
          console.log("✅ Production database connection successful on retry");
        }
      } else {
        console.log("💡 Development mode: continuing with database setup");
      }
    } else {
      console.log("✅ Database connection successful");
    }

    // Initialize database tables
    const dbInit = await initializeDatabase();
    if (!dbInit.success) {
      console.error(
        "❌ Database initialization failed:",
        dbInit.error,
      );
      
      if (process.env.NODE_ENV === 'production') {
        console.log("🔄 Production fallback: retrying database initialization");
        await new Promise(resolve => setTimeout(resolve, 2000));
        const retryInit = await initializeDatabase();
        if (!retryInit.success) {
          console.error("❌ Production database initialization retry failed");
          process.env.USE_MOCK_DB = 'true';
        } else {
          console.log("✅ Production database initialization successful on retry");
        }
      }
    } else {
      console.log("✅ Database initialization successful");
    }

    // Create default users
    try {
      const usersResult = await createDefaultUsers();
      if (usersResult.success) {
        console.log("✅ Default users created/verified");
      } else {
        console.warn("⚠️ Default users creation failed:", usersResult.error);
      }
    } catch (error) {
      console.warn("⚠️ Error creating default users:", error);
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

    // Start server - use 0.0.0.0 for all environments to ensure accessibility
    const host = '0.0.0.0';
    app.listen(PORT, host, () => {
      console.log(
        `🚀 Youth Dreamers Foundation Server running on ${host}:${PORT}`,
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

if (!IS_SERVERLESS && process.env.NODE_ENV !== "test") {
  startServer();
}

export function createServer() {
  return app;
}