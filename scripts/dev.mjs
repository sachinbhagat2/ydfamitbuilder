import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

console.log("🚀 Starting development servers...");

// Start backend server with tsx for TypeScript support
console.log("🔧 Starting backend server...");
const backendProcess = spawn("npx", ["tsx", "watch", "server/index.ts"], {
  cwd: projectRoot,
  stdio: ["inherit", "inherit", "inherit"],
  shell: true,
  env: { ...process.env, NODE_ENV: "development" },
});

backendProcess.on("error", (error) => {
  console.error("❌ Backend server error:", error);
});

backendProcess.on("exit", (code) => {
  console.log(`Backend process exited with code ${code}`);
});

// Wait for backend to be ready before starting frontend
const waitForBackend = async () => {
  const maxAttempts = 30;
  const delay = 1000; // 1 second
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch('http://localhost:3000/api/ping');
      if (response.ok) {
        console.log('✅ Backend is ready, starting frontend...');
        return true;
      }
    } catch (error) {
      // Backend not ready yet
    }
    
    console.log(`⏳ Waiting for backend... (${attempt}/${maxAttempts})`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  console.log('⚠️ Backend not ready after 30 seconds, starting frontend anyway...');
  return false;
};

// Start frontend after backend is ready
waitForBackend().then(() => {
  const frontendProcess = spawn("npx", ["vite", "--host", "0.0.0.0", "--port", "5173"], {
    cwd: projectRoot,
    stdio: "inherit",
    shell: true,
  });

  frontendProcess.on("error", (error) => {
    console.error("❌ Frontend server error:", error);
  });

  frontendProcess.on("exit", (code) => {
    console.log(`Frontend process exited with code ${code}`);
    backendProcess.kill();
  });

  // Handle process termination
  process.on("SIGINT", () => {
    console.log("\n🛑 Shutting down development servers...");
    backendProcess.kill();
    frontendProcess.kill();
    process.exit();
  });

  process.on("SIGTERM", () => {
    backendProcess.kill();
    frontendProcess.kill();
    process.exit();
  });
}, 2000);