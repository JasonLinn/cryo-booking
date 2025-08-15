# 冷凍乾燥設備預約系統 (Cryo Equipment Booking System)

> 🚀 **狀態**：已完成並可部署到生產環境  
> 🗃️ **資料庫**：PostgreSQL (已從 SQLite 遷移)  
> 📱 **支援**：完整響應式設計，支援手機、平板、桌面裝置

## ✨ 主要功能

### 🎯 核心功能
- **日期優先預約流程**：點擊日曆日期 → 選擇設備 → 完成預約
- **多時間檢視**：支援月/週/日檢視切換
- **設備狀態管理**：5種設備狀態（開放預約/請詢問管理員/籌備中/維護中/不可用）
- **預約審核系統**：管理員可審核預約申請
- **電子郵件通知**：預約成功自動寄信通知使用者
- **響應式設計**：完整手機版面優化

### 👥 使用者角色
- **一般使用者**：瀏覽設備、建立預約、查看我的預約
- **系統管理員**：設備管理、預約審核、系統設定

### 🔧 設備管理
- **四種冷凍乾燥設備**：設備 A、B、C、D
- **靈活時段設定**：每台設備可獨立設定可用時段
- **工作日限制**：預設週一至週五開放，週末關閉
- **狀態控制**：精細的設備狀態管理

## 🛠️ 技術架構

### 前端技術
- **Next.js 14.0.4** - React 框架 (App Router)
- **TypeScript** - 型別安全
- **Tailwind CSS** - 樣式框架
- **shadcn/ui** - UI 元件庫
- **date-fns** - 日期處理
- **Lucide React** - 圖示庫

### 後端技術
- **Next.js API Routes** - 後端 API
- **Prisma ORM** - 資料庫 ORM
- **NextAuth.js** - 身份認證
- **bcryptjs** - 密碼加密

### 資料庫
- **PostgreSQL** - 生產環境資料庫
- **完整 Enum 支援** - 型別安全的狀態管理

## 🚀 快速開始

### 前置需求
- Node.js 18+ 
- PostgreSQL 資料庫
- Git

### 安裝步驟

1. **複製專案**
   ```bash
   git clone <repository-url>
   cd cryo-booking
   ```

2. **安裝相依套件**
   ```bash
   npm install
   ```

3. **環境設定**
   ```bash
   # 複製環境變數範本
   cp .env.example .env
   
   # 編輯 .env 檔案，設定以下變數：
   DATABASE_URL="postgresql://username:password@host:port/database"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **資料庫設定**
   ```bash
   # 生成 Prisma client
   npx prisma generate
   
   # 推送資料庫 schema
   npx prisma db push
   
   # 初始化基礎資料
   curl http://localhost:3000/api/init
   ```

5. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

6. **開啟瀏覽器**
   訪問 `http://localhost:3000`

## 📖 使用指南

### 🎯 預約流程
1. 在主頁日曆上點擊想要的日期
2. 在彈出對話框中選擇可用的設備
3. 填寫預約資訊（時間、用途等）
4. 提交預約申請
5. 等待管理員審核
6. 收到電子郵件通知結果

### 👨‍💼 管理員功能
- **設備管理** (`/admin/equipment`)：新增、編輯、刪除設備
- **狀態控制**：變更設備狀態（開放/維護/停用等）
- **預約審核**：審核使用者的預約申請
- **系統監控**：查看系統使用狀況

### 📱 手機使用
- 完整支援手機瀏覽器
- 觸控友善的操作介面
- 自適應螢幕尺寸
- 手機優化的導航選單

## 🎨 設備狀態系統

| 狀態 | 徽章 | 可預約 | 說明 |
|------|------|--------|------|
| AVAILABLE | 🟢 開放預約 | ✅ | 設備正常運作，開放預約 |
| ASK_ADMIN | 🟡 請詢問管理員 | ⚠️ | 需要管理員特別確認的預約 |
| PREPARING | 🔵 籌備中 | ❌ | 設備準備中，暫時無法預約 |
| MAINTENANCE | 🔴 維護中 | ❌ | 設備維護中，無法使用 |
| UNAVAILABLE | ⚫ 不可用 | ❌ | 設備故障或長期停用 |

## 🚀 部署指南

### Vercel 部署 (推薦)
1. 將專案推送到 GitHub
2. 在 Vercel 連接 GitHub repository
3. 設定環境變數：
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET` 
   - `NEXTAUTH_URL`
4. 自動部署完成

### 手動部署
```bash
# 建構專案
npm run build

# 啟動生產伺服器
npm start
```

## 📁 專案結構

```
cryo-booking/
├── app/                    # Next.js 13+ App Router
│   ├── (pages)/           # 頁面路由
│   ├── api/               # API 路由
│   └── admin/             # 管理員頁面
├── components/            # 可重用元件
├── lib/                   # 工具函式
├── prisma/                # 資料庫 schema 和遷移
├── types/                 # TypeScript 型別定義
└── public/                # 靜態資源
```

## 🔧 開發指令

```bash
# 開發模式
npm run dev

# 建構專案
npm run build

# 型別檢查
npm run type-check

# 資料庫管理
npx prisma studio
```

## 📚 相關文件

- **[遷移記錄](./MIGRATION_LOG.md)** - 資料庫遷移詳細記錄
- **[專案設定](./PROJECT_CONFIG.md)** - 完整專案配置說明
- **[快速啟動](./QUICK_START.md)** - 開發者快速上手指南
- **[資料庫設定](./DATABASE_CONFIG.md)** - 資料庫詳細設定說明

## 🤝 貢獻指南

1. Fork 專案
2. 建立功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交變更 (`git commit -m 'Add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

## 📄 授權

此專案採用 MIT 授權 - 詳見 [LICENSE](LICENSE) 檔案

## 📞 支援

如遇到問題，請：
1. 查看 [快速啟動指南](./QUICK_START.md)
2. 檢查 [常見問題解決方案](./DATABASE_CONFIG.md#常見錯誤解決)
3. 開啟 GitHub Issue

---

**⚠️ 重要提醒**：此專案已遷移到 PostgreSQL，請勿使用舊的 SQLite 設定檔案。