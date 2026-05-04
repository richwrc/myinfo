import { copyFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const __dirname = dirname(fileURLToPath(import.meta.url))

// GitHub Pages SPA：子路徑直接開網址或重新整理時，用 404.html 回傳同一個 index
const spa404Plugin = () => ({
  name: 'spa-github-pages-404',
  apply: 'build',
  closeBundle() {
    copyFileSync(resolve(__dirname, 'dist/index.html'), resolve(__dirname, 'dist/404.html'))
  },
})

// https://vite.dev/config/
// 本機 dev 用根路徑；production build 給 GitHub Pages 子路徑（repo 名稱 myinfo）
export default defineConfig(({ mode }) => ({
  plugins: [vue(), spa404Plugin()],
  base: mode === 'production' ? '/myinfo/' : '/',
}))
