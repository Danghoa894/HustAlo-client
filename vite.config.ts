// vite.config.ts (repo HustAlo-client)
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Chứng chỉ mkcert nằm ở monorepo HustAlo (D-24, development_guide.md §2.6).
const serverDir = process.env.HUSTALO_SERVER_DIR ?? fileURLToPath(new URL('../HustAlo', import.meta.url));
const certFile = join(serverDir, 'infra', 'certs', 'localhost+lan.pem');
const keyFile = join(serverDir, 'infra', 'certs', 'localhost+lan-key.pem');

const API_TARGET = 'http://localhost:4000';

export default defineConfig(({ command, mode }) => {
  // DG-01: HTTP mặc định; HTTPS chỉ khi VITE_HTTPS=1 (client/.env hoặc biến môi trường). `vite build` không cần chứng chỉ.
  const env = { ...loadEnv(mode, process.cwd(), 'VITE_'), ...process.env };
  const https = command === 'serve' && env.VITE_HTTPS === '1';
  if (https && (!existsSync(certFile) || !existsSync(keyFile))) {
    throw new Error(
      'VITE_HTTPS=1 nhưng thiếu chứng chỉ trong <HUSTALO_SERVER_DIR>/infra/certs. Chạy trong HustAlo: mkcert -install && npm run certs',
    );
  }

  return {
    plugins: [react()],
    server: {
      host: true, // lắng nghe 0.0.0.0 để điện thoại trong LAN truy cập được (cần VITE_HTTPS=1)
      port: 5173,
      strictPort: true,
      ...(https ? { https: { cert: readFileSync(certFile), key: readFileSync(keyFile) } } : {}),
      proxy: {
        '/api': { target: API_TARGET, changeOrigin: false, xfwd: true },
        '/socket.io': { target: API_TARGET, ws: true, changeOrigin: false, xfwd: true },
      },
    },
    preview: { port: 4173, strictPort: true },
    build: { sourcemap: true, target: 'es2022' },
  };
});
