/// <reference types="vitest" />
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base =
  process.env.VITE_BASE_PATH ??
  (process.env.GITHUB_ACTIONS && repositoryName ? `/${repositoryName}/` : '/')

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    coverage: {
      provider: 'v8',
      include: [
        'src/core/utils/**/*.{ts,tsx}',
        'src/core/state/**/*.{ts,tsx}',
        'src/core/i18n/**/*.{ts,tsx}',
        'src/core/services/**/*.{ts,tsx}',
      ],
      exclude: [
        'src/**/*.d.ts',
        'src/test/**',
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/core/types/**',
        'src/core/i18n/locales/**',
        'src/core/utils/wikiDexAssets/**',
        'src/**/index.ts',
        'src/**/*.test.ts',
        'src/**/*.test.tsx',
      ],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 90,
        statements: 100,
        perFile: true,
      },
    },
  },
})
