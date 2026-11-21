# 生活工具箱

將 Newsfeed、Packing Tool 與 Recipe App 整合成同一個網站：

- `/news/`：newsfeed（新聞閱讀、收藏與稍後查看）
- `/packing/`：家私集（行李清單與分類進度）
- `/recipes/`：食譜收藏、搜尋與份量調整
- `/beauty/`：美妝避雷針，查品牌的主權、動物實驗爭議與所屬集團

前端是可輸出為靜態檔案的 Next.js 網站，由 GitHub Pages 託管；資料庫與伺服器端抓取功能由 Supabase 提供。

## 各工具檔案位置

| 工具 | 頁面外殼 | 工具本體 | Supabase Function |
|---|---|---|---|
| 食譜 | `src/app/recipes/` | `src/components/App.tsx` | `fetch-url` |
| newsfeed | `src/app/news/` | `public/tools/news/index.html` | `ebb` |
| 家私集 | `src/app/packing/` | `public/tools/packing/index.html` | — |
| 美妝避雷針 | `src/app/beauty/` | `public/tools/beauty/index.html` | — |

舊的獨立版本已移到上層的 `_archive/`，不再維護，請只修改這裡的檔案。

### 新增一個 HTML 工具

1. 放進 `public/tools/<名稱>/index.html`。
2. 新增 `src/app/<名稱>/page.tsx`：`<EmbeddedTool tool="<名稱>" title="…" />`。
3. 在 `EmbeddedTool.tsx`（tool 型別）、`ToolIcon.tsx`（圖示）、`AppNav.tsx`（導覽）、`src/app/page.tsx`（首頁卡片）各加一筆。

## 本機執行

1. 複製 `.env.local.example` 為 `.env.local`。
2. 填入同一個 Supabase 專案的 URL 與 publishable/anon key。
3. 執行：

```bash
npm install
npm run dev
```

開啟 <http://localhost:3000>。

## Supabase 初次設定

1. 在 Supabase Dashboard 的 SQL Editor 執行 `supabase-schema.sql`。
2. 安裝 Supabase CLI 並登入。
3. 連接專案並部署兩個 Functions：

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase functions deploy ebb --no-verify-jwt
npx supabase functions deploy fetch-url --no-verify-jwt
```

`ebb` 負責讀取 EBB 新聞；`fetch-url` 負責替食譜讀取網頁標題及描述。

## GitHub Pages 部署

1. 將此資料夾推送到 GitHub repository，預設分支使用 `main`。
2. 在 repository 的 **Settings → Secrets and variables → Actions** 新增：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. 在 **Settings → Pages → Build and deployment**，Source 選擇 **GitHub Actions**。
4. 推送到 `main`，`.github/workflows/deploy-pages.yml` 會自動建置和發布。

網站網址通常是 `https://GITHUB帳號.github.io/REPOSITORY名稱/`。

## 資料同步方式

- 食譜：Supabase `recipes`、`app_settings`
- 新聞狀態：Supabase `article_states`，localStorage 作為備援
- 家私集：Supabase `packing_state`，localStorage 作為離線備援

目前沿用原工具「不登入、共同使用」的模式，所以知道網站網址的人可共用同一份資料。若網站要公開分享，下一步應加入 Supabase Auth，並將 RLS 政策改成依使用者隔離資料。
