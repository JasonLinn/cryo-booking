# 低溫設備預約系統 (Cryo Booking System)

一個基於 Next.js 的實驗室低溫設備線上預約管理系統。

## 功能特色

### 使用者功能
- ✅ 使用者身份驗證 (Google OAuth / 帳號密碼)
- ✅ 直觀的日曆介面預約設備
- ✅ 查看個人預約記錄和狀態
- ✅ 即時預約狀態更新
- ✅ 郵件通知 (預約核准/拒絕)

### 管理員功能
- ✅ 預約申請審核
- ✅ 設備管理 (新增/編輯/停用)
- ✅ 時段設定 (不同設備可設定不同可用時段)
- ✅ 使用者管理
- ✅ 統計面板

### 系統特色
- 🔒 平日開放，假日自動關閉
- ⏰ 時間衝突檢測
- 📧 自動郵件通知
- 📱 響應式設計，支援手機/平板
- 🚀 可部署至 Vercel

## 技術架構

- **框架**: Next.js 14 (App Router)
- **資料庫**: PostgreSQL (支援 Vercel Postgres)
- **ORM**: Prisma
- **身份驗證**: NextAuth.js
- **UI 元件**: Tailwind CSS + shadcn/ui
- **郵件服務**: Resend
- **部署**: Vercel

## 專案結構

```
cryo-booking/
├── app/                    # Next.js App Router 頁面
│   ├── api/               # API 路由
│   ├── auth/              # 登入頁面
│   ├── admin/             # 管理員頁面
│   └── my-bookings/       # 使用者預約頁面
├── components/            # React 元件
│   ├── ui/               # 基礎 UI 元件
│   ├── calendar.tsx      # 日曆元件
│   ├── navbar.tsx        # 導航列
│   └── ...
├── lib/                   # 工具函式
│   ├── prisma.ts         # Prisma 客戶端
│   ├── auth.ts           # NextAuth 設定
│   ├── email.ts          # 郵件服務
│   └── utils.ts          # 通用工具
├── prisma/               # 資料庫 schema 和遷移
└── types/                # TypeScript 類型定義
```

## 快速開始

### 1. 安裝相依套件

```bash
npm install
```

### 2. 設定環境變數

複製 `.env.example` 為 `.env.local` 並填入必要的設定：

```bash
cp .env.example .env.local
```

必要設定：
- `POSTGRES_URL`: PostgreSQL 資料庫連線字串
- `NEXTAUTH_SECRET`: NextAuth 密鑰
- `RESEND_API_KEY`: Resend 郵件服務 API Key (可選)

### 3. 初始化資料庫

```bash
# 推送資料庫 schema
npm run db:push

# 建立種子資料
npm run db:seed
```

### 4. 啟動開發伺服器

```bash
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000) 檢視應用程式。

## 資料庫 Schema

### 主要資料表

- **User**: 使用者資訊
- **Equipment**: 設備資訊
- **TimeSlot**: 設備可用時段
- **Booking**: 預約記錄

### 預設資料

系統會自動建立：
- 管理員帳號: `admin@example.com`
- 測試使用者: `user@example.com`
- 4 個範例設備
- 平日 9:00-18:00 時段設定

## 部署至 Vercel

### 1. 準備專案

```bash
# 建構專案確認無誤
npm run build
```

### 2. 設定 Vercel Postgres

1. 在 Vercel 專案中新增 Postgres 資料庫
2. 複製資料庫連線變數到環境設定

### 3. 設定環境變數

在 Vercel 專案設定中加入：
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `RESEND_API_KEY`
- `GOOGLE_CLIENT_ID` (可選)
- `GOOGLE_CLIENT_SECRET` (可選)

### 4. 部署

```bash
# 使用 Vercel CLI
npx vercel

# 或推送到 GitHub 後連結 Vercel 自動部署
```

### 5. 初始化生產資料庫

部署完成後，在 Vercel 函式中執行：

```bash
# 推送 schema
npx prisma db push

# 建立種子資料
npx prisma db seed
```

## 使用指南

### 一般使用者

1. **登入系統**: 使用 Google 帳號或註冊新帳號
2. **選擇設備**: 在首頁點選要預約的設備
3. **選擇時間**: 點擊日曆上的日期，選擇時間段
4. **填寫申請**: 輸入使用目的並提交
5. **等待審核**: 管理員審核後會收到郵件通知

### 管理員

1. **審核預約**: 前往管理面板查看待審核申請
2. **管理設備**: 新增或編輯設備資訊
3. **設定時段**: 為不同設備設定可用時間
4. **查看統計**: 監控系統使用情況

## 開發

### 新增設備類型

1. 在 `prisma/schema.prisma` 中修改 Equipment model
2. 執行 `npm run db:push` 更新資料庫
3. 在 `prisma/seed.ts` 中新增範例資料

### 自訂時段規則

修改 `lib/utils.ts` 中的 `isTimeSlotAvailable` 函式來實作自訂的時段檢查邏輯。

### 新增通知方式

在 `lib/email.ts` 中擴展 `sendEmail` 函式來支援其他通知方式 (如 LINE、SMS)。

## 故障排除

### 常見問題

**Q: 無法連接到資料庫**
A: 檢查 `.env.local` 中的 `POSTGRES_URL` 是否正確

**Q: 郵件無法發送**
A: 確認已設定有效的 `RESEND_API_KEY`

**Q: 登入失敗**
A: 檢查 `NEXTAUTH_SECRET` 是否已設定

### 開發模式除錯

```bash
# 檢視資料庫內容
npm run db:studio

# 檢查 API 端點
curl http://localhost:3000/api/equipment
```

## 貢獻

歡迎提交 Issue 和 Pull Request 來改善這個專案！

## 授權

MIT License - 詳見 [LICENSE](LICENSE) 檔案。