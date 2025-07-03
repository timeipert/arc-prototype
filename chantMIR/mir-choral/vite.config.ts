import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';   //  ← unbedingt dabei

export default defineConfig({
  plugins: [vue()],
  base: '/arc-prototype/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})