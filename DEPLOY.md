# 部署指南 - 如何分享應用程式給其他人使用

有幾種方式可以讓其他人使用這個應用程式：

## 方法 1: GitHub Pages（推薦 - 免費且簡單）

### 步驟：

1. **安裝 GitHub Pages 插件**：
```bash
npm install --save-dev gh-pages
```

2. **更新 package.json**，添加部署腳本：
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

3. **更新 vite.config.js**，添加 base 路徑：
```js
export default defineConfig({
  base: '/YOUR_REPO_NAME/',
  plugins: [react()],
})
```

4. **推送到 GitHub 並部署**：
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
npm run deploy
```

5. **在 GitHub 設置**：
   - 前往 Settings > Pages
   - Source 選擇 `gh-pages` 分支
   - 保存後，應用會在 `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/` 可用

---

## 方法 2: Vercel（推薦 - 最簡單）

### 步驟：

1. **安裝 Vercel CLI**（可選）：
```bash
npm install -g vercel
```

2. **在 Vercel 部署**：
   - 前往 https://vercel.com
   - 使用 GitHub 登入
   - 點擊 "New Project"
   - 導入你的 GitHub 倉庫
   - Vercel 會自動檢測 Vite 項目並部署
   - 完成後會獲得一個 URL，例如：`https://your-app.vercel.app`

**優點**：
- 完全免費
- 自動部署（每次 push 到 GitHub 都會自動更新）
- 全球 CDN，速度快
- 無需配置

---

## 方法 3: Netlify（免費且簡單）

### 步驟：

1. **前往 Netlify**：
   - 前往 https://www.netlify.com
   - 使用 GitHub 登入

2. **部署**：
   - 點擊 "Add new site" > "Import an existing project"
   - 選擇你的 GitHub 倉庫
   - Build command: `npm run build`
   - Publish directory: `dist`
   - 點擊 "Deploy site"

3. **完成**：
   - 會獲得一個 URL，例如：`https://your-app.netlify.app`

---

## 方法 4: 本地運行（給技術人員）

如果對方有 Node.js 環境：

1. **克隆倉庫**：
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

2. **安裝依賴**：
```bash
npm install
```

3. **運行**：
```bash
npm run dev
```

4. **訪問**：
   - 打開瀏覽器訪問 `http://localhost:5173`

---

## 方法 5: 打包成靜態文件

1. **建置應用**：
```bash
npm run build
```

2. **分享 dist 文件夾**：
   - 將 `dist` 文件夾打包成 zip
   - 發送給對方
   - 對方可以使用任何靜態文件服務器運行（如 Python 的 `python -m http.server`）

---

## 推薦方案

**最簡單**：使用 Vercel 或 Netlify
- 免費
- 自動部署
- 無需配置
- 獲得公開 URL，任何人都可以訪問

**最專業**：GitHub Pages
- 免費
- 與 GitHub 集成
- 適合開源項目
