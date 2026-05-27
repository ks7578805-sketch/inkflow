import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import path from 'node:path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_BASE_URL || 'http://localhost:3001'

  return {
    logLevel: 'error',
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@inkflow/contracts': path.resolve(__dirname, '../../packages/contracts/src/index.ts'),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/v1': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
