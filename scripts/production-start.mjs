
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

console.log("🚀 Starting production build and deploy...");

// Check if build exists
const distPath = join(projectRoot, "dist", "spa");
const buildExists = fs.existsSync(distPath);

if (!buildExists) {
  console.log("📦 Building frontend...");
  
  // Build frontend first
  const buildProcess = spawn("npm", ["run", "build:client"], {
    cwd: projectRoot,
    stdio: "inherit",
    shell: true,
  });

  buildProcess.on("exit", (code) => {
    if (code === 0) {
      console.log("✅ Frontend build complete");
      startServer();
    } else {
      console.error("❌ Frontend build failed");
      process.exit(1);
    }
  });
} else {
  console.log("✅ Build already exists, starting server...");
  startServer();
}

function startServer() {
  console.log("🚀 Starting production server...");
  
  const serverProcess = spawn("npm", ["start"], {
    cwd: projectRoot,
    stdio: "inherit",
    shell: true,
    env: { ...process.env, NODE_ENV: "production" },
  });

  serverProcess.on("error", (error) => {
    console.error("❌ Server error:", error);
  });

  serverProcess.on("exit", (code) => {
    console.log(`Server process exited with code ${code}`);
  });

  // Handle process termination
  process.on("SIGINT", () => {
    console.log("\n🛑 Shutting down production server...");
    serverProcess.kill();
    process.exit();
  });

  process.on("SIGTERM", () => {
    serverProcess.kill();
    process.exit();
  });
}
