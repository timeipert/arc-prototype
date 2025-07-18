// vite.config.ts
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ command, mode }) => {

  return {
    plugins: [vue()],
    base: command === 'build' ? '/arc-prototype/' : '/',
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } }
  };
});
