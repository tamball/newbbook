# New Believer Devotional App

A devotional journaling app designed for new believers in Jesus, featuring 8 weeks of content with 7 days per week (Monday-Friday devotional entries, Saturday full chapter reading, Sunday sermon notes).

## Features

- 📅 **8-Week Devotional Plan**: Complete 8-week journey (7 days per week)
- 📖 **Daily Scripture**: 40 carefully selected Bible passages to help new believers grow
- 💭 **Reflection Questions**: Thought-provoking questions to guide deeper reflection
- 📝 **Personal Journaling**: Four entry fields
  - Main Content
  - Personal Reflection
  - Application
  - Prayer
- 📖 **Saturday Full Chapter Reading**: Full chapter reading each Saturday, no entry required
- ✝️ **Sunday Sermon Notes**: Record Sunday service sermon content
- 📧 **Send to Spiritual Mentor**: Send devotional entries to your spiritual mentor
- 💾 **Auto-Save**: All entries automatically saved using localStorage
- 📊 **Progress Tracking**: Visual progress display including overall progress bar chart
- 🎨 **Modern UI**: Beautiful, responsive interface design

## Installation & Running

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open the displayed URL in your browser (usually http://localhost:5173)

## Build for Production

```bash
npm run build
```

Built files will be in the `dist` directory.

## 部署到線上

### 使用 Vercel（推薦 - 最簡單）

1. 前往 https://vercel.com
2. 使用 GitHub 登入
3. 點擊 "Add New Project"
4. 選擇你的 GitHub 倉庫
5. Vercel 會自動檢測並部署
6. 完成後會獲得一個公開 URL

### 使用 GitHub Pages

```bash
npm run deploy
```

然後在 GitHub 倉庫的 Settings > Pages 中設置 `gh-pages` 分支為源。

詳見 [DEPLOY.md](./DEPLOY.md) 了解更多部署選項。
## Tech Stack

- React 18
- Vite
- CSS3
- LocalStorage (data persistence)

## Usage Instructions

1. **Initial Setup**:
   - Enter start date (must be a Monday, defaults to next Monday)
   - Enter spiritual mentor name and email address

2. **Daily Devotionals** (Monday-Friday):
   - Select week and day
   - Read the day's scripture and reflection question
   - Record your devotional insights in four fields
   - Content is automatically saved

3. **Saturday**:
   - Read full chapter scripture
   - No entry required

4. **Sunday**:
   - Record Sunday service sermon notes

5. **Send Entries**:
   - Click "Send to Mentor" button
   - Opens email client with pre-filled content

## Data Structure

All devotional entries are stored in the browser's localStorage and will not be lost even after closing the browser. Data format:

```json
{
  "1-1": {
    "week": 1,
    "day": 1,
    "mainContent": "...",
    "personalReflection": "...",
    "application": "...",
    "prayer": "...",
    "updatedAt": "2026-02-07T..."
  }
}
```

## Notes

- Data is stored in the browser's localStorage
- Clearing browser data will result in loss of entries
- Recommend regular backup of important entries

## License

This project is designed for personal devotional use.
