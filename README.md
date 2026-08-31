# 生活工具箱

將 Newsfeed、Packing Tool 與 Recipe App 整合成同一個網站：

- `/news/`：新聞閱讀、收藏與稍後查看
- `/packing/`：行李清單與分類進度
- `/recipes/`：食譜收藏、搜尋與份量調整

前端是可輸出為靜態檔案的 Next.js 網站，由 GitHub Pages 託管；資料庫與伺服器端抓取功能由 Supabase 提供。

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
- 行李清單：Supabase `packing_state`，localStorage 作為離線備援

目前沿用原工具「不登入、共同使用」的模式，所以知道網站網址的人可共用同一份資料。若網站要公開分享，下一步應加入 Supabase Auth，並將 RLS 政策改成依使用者隔離資料。
