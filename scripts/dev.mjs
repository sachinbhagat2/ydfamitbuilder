import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

console.log("🚀 Starting development servers...");

// Start backend server with tsx for TypeScript support
const backendProcess = spawn("npx", ["tsx", "watch", "server/index.ts"], {
  cwd: projectRoot,
  stdio: "inherit",
  env: { ...process.env, NODE_ENV: "development" },
});

backendProcess.on("error", (error) => {
  console.error("❌ Backend server error:", error);
});

backendProcess.on("exit", (code) => {
  console.log(`Backend process exited with code ${code}`);
});

// Start frontend dev server
const frontendProcess = spawn("npm", ["run", "dev:client"], {
  cwd: projectRoot,
  stdio: "inherit",
});

frontendProcess.on("error", (error) => {
  console.error("❌ Frontend server error:", error);
});

frontendProcess.on("exit", (code) => {
  console.log(`Frontend process exited with code ${code}`);
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