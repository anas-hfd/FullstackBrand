import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
  resolve: {
    // Mirrors the `@/*` -> `./*` alias declared in tsconfig.json
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
})
