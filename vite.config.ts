import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    base: '/', 
    define: {
      // Specific replacement for API Key
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY),
      // IMPORTANT: Do NOT blindly overwrite process.env with {}, as it removes NODE_ENV
      // causing React to run in development mode or crash in production.
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      emptyOutDir: true,
    },
    server: {
      port: 3000,
      open: true
    }
  };
});