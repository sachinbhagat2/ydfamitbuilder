import { spawn } from "node:child_process";

const procs = [];

function run(name, cmd, args, opts = {}) {
  const p = spawn(cmd, args, { stdio: "inherit", shell: false, ...opts });
  procs.push(p);
  p.on("exit", (code, signal) => {
    if (code !== 0) {
      console.error(
        `[${name}] exited with code ${code}${signal ? ` (signal ${signal})` : ""}`,
      );
      shutdown(code ?? 1);
    }
  });
  return p;
}

function shutdown(code = 0) {
  for (const p of procs) {
    if (!p.killed) {
      try {
        p.kill("SIGTERM");
      } catch {}
    }
  }
  // Give children a moment to exit cleanly
  setTimeout(() => process.exit(code), 500);
}

process.on("SIGINT", () => {
  console.log("Received SIGINT, shutting down...");
  shutdown(0);
});
process.on("SIGTERM", () => {
  console.log("Received SIGTERM, shutting down...");
  shutdown(0);
});

// Start API server (watch mode)
run("server", process.platform === "win32" ? "npx.cmd" : "npx", [
  "tsx",
  "watch",
  "server/index.ts",
]);

// Start Vite dev server
run("vite", process.platform === "win32" ? "npx.cmd" : "npx", ["vite"]);
