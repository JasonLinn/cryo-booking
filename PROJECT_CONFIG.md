# 專案設定檔案 (Project Configuration)

## 📁 檔案結構概覽

```
cryo-booking/
├── prisma/
│   ├── schema.prisma          # 🟢 生產環境 (PostgreSQL)
│   ├── schema.dev.prisma      # 🔵 開發環境 (SQLite - 保留)
│   └── dev.db                 # SQLite 資料庫檔案
├── .env                       # 環境變數 (包含 PostgreSQL 連接)
├── MIGRATION_LOG.md           # 資料庫遷移記錄
└── PROJECT_CONFIG.md          # 此檔案
```

## 🗃️ 資料庫設定

### 當前使用的資料庫：PostgreSQL
```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 環境變數 (.env)
```bash
DATABASE_URL="postgresql://[PostgreSQL連接字串]"
```

### ⚠️ 重要：不要混淆的檔案
- `prisma/schema.prisma` = PostgreSQL (生產環境) ✅ 當前使用
- `prisma/schema.dev.prisma` = SQLite (開發環境) ❌ 已棄用

## 🎨 UI/UX 功能狀態

### ✅ 已實作功能

#### 1. 預約流程改善
- **日期優先選擇**：點擊日曆日期 → 選擇設備
- **多時間檢視**：月/週/日 檢視切換
- **手機響應式**：完整手機版面優化

#### 2. 設備狀態系統
```typescript
enum EquipmentStatus {
  AVAILABLE     // 開放預約 (綠色徽章)
  ASK_ADMIN     // 請詢問管理員 (黃色徽章)
  PREPARING     // 籌備中 (藍色徽章)
  MAINTENANCE   // 維護中 (紅色徽章)
  UNAVAILABLE   // 不可用 (灰色徽章)
}
```

#### 3. 權限系統
```typescript
enum Role {
  USER   // 一般使用者
  ADMIN  // 系統管理員
}
```

## 🔧 技術堆疊

### 前端
- **框架**：Next.js 14.0.4 (App Router)
- **樣式**：Tailwind CSS
- **UI 元件**：shadcn/ui
- **圖示**：Lucide React
- **日期處理**：date-fns

### 後端
- **Runtime**：Node.js
- **API**：Next.js API Routes
- **認證**：NextAuth.js
- **資料庫 ORM**：Prisma 5.22.0

### 資料庫
- **生產環境**：PostgreSQL
- **開發環境**：SQLite (保留作為備份)

## 📱 響應式設計

### 斷點設計
```css
/* Tailwind 斷點 */
sm: 640px    /* 手機橫向 */
md: 768px    /* 平板 */
lg: 1024px   /* 桌面 */
xl: 1280px   /* 大螢幕 */
```

### 手機優化項目
- ✅ 日曆元件自適應
- ✅ 設備選擇對話框
- ✅ 導航選單響應式
- ✅ 表單輸入優化
- ✅ 觸控友善按鈕大小

## 🎯 頁面結構

### 公開頁面
- `/` - 主頁 (預約日曆)
- `/auth/signin` - 登入頁面
- `/demo` - 展示頁面

### 使用者頁面
- `/my-bookings` - 我的預約

### 管理員頁面
- `/admin/dashboard` - 管理儀表板
- `/admin/equipment` - 設備管理
- `/admin/equipment-colors` - 設備顏色管理

### API 端點
```
api/
├── auth/[...nextauth]/     # NextAuth 認證
├── bookings/              # 預約管理
├── equipment/             # 設備管理
├── init/                  # 系統初始化
└── admin/                 # 管理員功能
    ├── initialize/        # 管理員初始化
    └── reset/             # 重設系統
```

## 🔐 認證與授權

### NextAuth 設定
- **Provider**：Credentials (帳號密碼)
- **Session 策略**：JWT
- **保護路由**：中介軟體自動保護

### 權限控制
```typescript
// 管理員專用頁面
if (session?.user?.role !== 'ADMIN') {
  return redirect('/auth/signin')
}
```

## 🚀 部署設定

### 環境變數需求
```bash
# 資料庫
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="[隨機金鑰]"
NEXTAUTH_URL="https://your-domain.com"

# 其他設定
NODE_ENV="production"
```

### 建構指令
```bash
# 安裝相依套件
npm install

# 生成 Prisma client
npx prisma generate

# 建構專案
npm run build

# 啟動生產伺服器
npm start
```

## 📝 開發指令

### 常用指令
```bash
# 開發模式
npm run dev

# 型別檢查
npm run type-check

# 建構測試
npm run build

# Prisma 相關
npx prisma studio          # 資料庫 GUI
npx prisma db push          # 推送 schema 變更
npx prisma generate         # 生成 client
npx prisma migrate dev      # 建立遷移檔案
```

## 🎨 設計系統

### 顏色主題
```css
/* 設備狀態顏色 */
--status-available: #10B981     /* 綠色 */
--status-ask-admin: #F59E0B     /* 黃色 */
--status-preparing: #3B82F6     /* 藍色 */
--status-maintenance: #EF4444   /* 紅色 */
--status-unavailable: #6B7280   /* 灰色 */

/* 設備預設顏色 */
--equipment-a: #FF6B6B          /* 紅色 */
--equipment-b: #4ECDC4          /* 藍綠色 */
--equipment-c: #45B7D1          /* 藍色 */
--equipment-d: #96CEB4          /* 綠色 */
```

### UI 元件
- **按鈕**：shadcn/ui Button 元件
- **對話框**：shadcn/ui Dialog 元件
- **表單**：shadcn/ui Form 元件
- **徽章**：shadcn/ui Badge 元件

## 🧪 測試策略

### 功能測試清單
- [ ] 使用者註冊/登入
- [ ] 設備預約流程
- [ ] 管理員設備管理
- [ ] 手機版面測試
- [ ] 多時區測試

### 效能測試
- [ ] 頁面載入速度
- [ ] 資料庫查詢效能
- [ ] 大量預約處理

## 📋 維護清單

### 定期檢查項目
- [ ] 資料庫備份
- [ ] 相依套件更新
- [ ] 安全性漏洞掃描
- [ ] 效能監控

### 故障排除
1. **Prisma 連接問題**：檢查 DATABASE_URL
2. **認證失敗**：檢查 NEXTAUTH 設定
3. **編譯錯誤**：確認 TypeScript 類型

---
**建立日期**：2025年8月16日  
**最後更新**：2025年8月16日  
**維護者**：開發團隊
