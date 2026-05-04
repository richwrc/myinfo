import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
// 本機 dev 用根路徑；production build 給 GitHub Pages 子路徑（repo 名稱 myinfo）
export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  base: mode === 'production' ? '/myinfo/' : '/',
}))
