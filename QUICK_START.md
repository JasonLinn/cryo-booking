# 快速啟動指南 (Quick Start Guide)

> 🚨 **重要提醒**：此專案已從 SQLite 遷移到 PostgreSQL！

## 🗃️ 資料庫狀態確認

### 當前設定 ✅
- **資料庫**：PostgreSQL
- **Schema 檔案**：`prisma/schema.prisma`
- **連接字串**：`.env` 中的 `DATABASE_URL`

### ⚠️ 不要使用的舊檔案
- ❌ `prisma/schema.dev.prisma` (SQLite 舊版本)
- ❌ `prisma/dev.db` (SQLite 資料庫檔案)

## 🚀 快速啟動

### 1. 環境設定
```bash
# 確認環境變數
cat .env
# 應該看到：DATABASE_URL="postgresql://..."
```

### 2. 安裝相依套件
```bash
npm install
```

### 3. 資料庫設定
```bash
# 生成 Prisma client (重要！)
npx prisma generate

# 檢查資料庫連接
npx prisma db pull
```

### 4. 啟動開發伺服器
```bash
npm run dev
```

### 5. 初始化資料
訪問：`http://localhost:3000/api/init`

## 🔍 功能測試清單

### ✅ 基本功能
- [ ] 主頁日曆顯示正常
- [ ] 點擊日期可選擇設備
- [ ] 設備狀態顯示正確
- [ ] 手機版面正常

### ✅ 管理功能
- [ ] 設備管理頁面：`/admin/equipment`
- [ ] 狀態變更功能
- [ ] 新增設備功能

## 🎯 設備狀態說明

| 狀態 | 顯示 | 可預約 | 說明 |
|------|------|--------|------|
| AVAILABLE | 🟢 開放預約 | ✅ | 正常可預約 |
| ASK_ADMIN | 🟡 請詢問管理員 | ⚠️ | 需管理員確認 |
| PREPARING | 🔵 籌備中 | ❌ | 準備中 |
| MAINTENANCE | 🔴 維護中 | ❌ | 維護中 |
| UNAVAILABLE | ⚫ 不可用 | ❌ | 停用 |

## 🛠️ 常見問題解決

### Q1: Prisma 類型錯誤
```bash
# 解決方案：重新生成 client
npx prisma generate
```

### Q2: 資料庫連接失敗
```bash
# 檢查 .env 檔案
echo $DATABASE_URL
# 或在 Windows
echo %DATABASE_URL%
```

### Q3: 編譯錯誤
```bash
# 清除快取並重新建構
rm -rf .next
npm run build
```

### Q4: 設備狀態顯示錯誤
- 確認已使用 PostgreSQL (不是 SQLite)
- 確認 Prisma client 已重新生成
- 檢查 enum 類型是否正確匯入

## 📁 重要檔案位置

### 設定檔案
- `prisma/schema.prisma` - 資料庫 schema (PostgreSQL)
- `.env` - 環境變數
- `next.config.js` - Next.js 設定

### 主要元件
- `components/calendar.tsx` - 主要日曆元件
- `components/equipment-select-dialog.tsx` - 設備選擇對話框
- `app/admin/equipment/page.tsx` - 設備管理頁面

### API 路由
- `app/api/equipment/route.ts` - 設備 CRUD
- `app/api/bookings/route.ts` - 預約管理
- `app/api/init/route.ts` - 系統初始化

## 🎨 自訂設定

### 修改設備顏色
編輯 `app/admin/equipment-colors/page.tsx`

### 調整狀態規則
編輯 `lib/utils.ts` 中的 `canBookEquipment` 函式

### 新增設備狀態
1. 修改 `prisma/schema.prisma` 的 EquipmentStatus enum
2. 執行 `npx prisma db push`
3. 執行 `npx prisma generate`
4. 更新相關 UI 元件

## 🚀 部署準備

### Vercel 部署
1. 連接 GitHub repository
2. 設定環境變數：
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
3. 自動部署

### 手動部署
```bash
# 建構專案
npm run build

# 啟動生產伺服器
npm start
```

## 📞 支援

### 檢查清單
1. ✅ 確認使用 PostgreSQL (不是 SQLite)
2. ✅ 確認 .env 設定正確
3. ✅ 確認 Prisma client 已生成
4. ✅ 確認所有套件已安裝

### 除錯工具
```bash
# 檢查資料庫狀態
npx prisma studio

# 檢查資料庫 schema
npx prisma db pull

# 檢查編譯狀態
npm run build
```

---
**記住**：這是 PostgreSQL 專案，不是 SQLite！  
如有疑問，請參考 `MIGRATION_LOG.md` 和 `PROJECT_CONFIG.md`
