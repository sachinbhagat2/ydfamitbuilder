import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🚀 Starting development servers...');

// Start Express backend server
const backend = spawn('node', ['server/index.ts'], {
  cwd: rootDir,
  stdio: ['inherit', 'inherit', 'inherit'],
  shell: true,
  env: { ...process.env, NODE_ENV: 'development' }
});

// Start Vite dev server after a short delay
setTimeout(() => {
  const vite = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '5173'], {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true
  });

  vite.on('close', (code) => {
    console.log(`Vite process exited with code ${code}`);
    backend.kill();
  });

  vite.on('error', (err) => {
    console.error('Failed to start Vite:', err);
    backend.kill();
  });
}, 2000);

backend.on('close', (code) => {
  console.log(`Backend process exited with code ${code}`);
});

backend.on('error', (err) => {
  console.error('Failed to start backend:', err);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development servers...');
  backend.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down development servers...');
  backend.kill();
  process.exit(0);
});