# myinfo

Vue 3 履歷網站，部署於 [GitHub Pages](https://richwrc.github.io/myinfo/)。

## 本機開發

```bash
npm install
npm run dev
```

## 部署到 GitHub Pages（一次設定）

空白頁通常是因為 **Pages 還在提供原始碼的 `index.html`**（會去載入 `/src/main.js`，在 `github.io/myinfo` 底下路徑錯誤）。請改為用 **GitHub Actions 部署建置後的 `dist/`**。

1. 打開 GitHub Repo：**Settings** → **Pages**
2. **Build and deployment** → **Source** 選 **GitHub Actions**（不要選「Deploy from a branch」指到 `main` 根目錄）
3. 到 **Actions** 分頁，確認 workflow「Deploy to GitHub Pages」有成功跑完（推送 `main` 會自動觸發）
4. 幾分鐘後重新整理 [https://richwrc.github.io/myinfo/](https://richwrc.github.io/myinfo/)

若第一次使用 GitHub Actions 部署 Pages，有時需在 **Environments** 核准 `github-pages` 環境（依 GitHub 提示操作即可）。

## 建置預覽

```bash
npm run build
npm run preview
```

預覽時請開終端機顯示的網址，並加上子路徑前綴 `/myinfo/`（與正式站相同）。
