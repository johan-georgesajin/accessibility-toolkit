import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@a11y-toolkit/core': fileURLToPath(new URL('../../packages/core/src', import.meta.url)),
      '@a11y-toolkit/visual': fileURLToPath(new URL('../../packages/visual/src', import.meta.url)),
      '@a11y-toolkit/modes': fileURLToPath(new URL('../../packages/modes/src', import.meta.url)),
    },
  },
});
