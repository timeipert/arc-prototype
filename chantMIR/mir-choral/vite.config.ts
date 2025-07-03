// vite.config.ts
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode }) => {
  // read .env files (VITE_* come in as strings)
  const env = loadEnv(mode, process.cwd(), '');
  const repo = env.VITE_GH_REPO || '';   // "" in dev, "arc-prototype" in pages

  return {
    plugins: [vue()],
    base: repo ? `/${repo}/` : '/',      // "/" locally, "/repo/" on pages
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } }
  };
});
