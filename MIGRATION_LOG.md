# 資料庫遷移記錄 (Database Migration Log)

## 📅 遷移日期：2025年8月16日

## 🎯 遷移目標
從 SQLite 開發環境遷移到 PostgreSQL 生產環境，並實作進階設備狀態管理系統。

## 📋 遷移前狀態
- **資料庫**：SQLite (`dev.db`)
- **Provider**：`sqlite`
- **設備狀態**：簡單的 `isActive` boolean 欄位
- **問題**：無法滿足複雜的設備狀態需求

## 🚀 遷移後狀態
- **資料庫**：PostgreSQL
- **Provider**：`postgresql`
- **連接字串**：`DATABASE_URL` 在 `.env` 檔案中
- **設備狀態**：完整的 `EquipmentStatus` enum 系統

## 🔧 主要變更

### 1. Prisma Schema 更新 (`prisma/schema.prisma`)

```prisma
// 變更前
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model Equipment {
  id          String @id @default(cuid())
  name        String
  description String?
  location    String?
  color       String?
  isActive    Boolean @default(true)  // 舊欄位
  // ...其他欄位
}

// 變更後
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 新增 Enums
enum Role {
  USER
  ADMIN
}

enum EquipmentStatus {
  AVAILABLE     // 開放預約
  ASK_ADMIN     // 請詢問管理員
  PREPARING     // 籌備中
  MAINTENANCE   // 維護中
  UNAVAILABLE   // 不可用
}

enum BookingStatus {
  PENDING
  APPROVED
  REJECTED
}

model Equipment {
  id          String @id @default(cuid())
  name        String
  description String?
  location    String?
  color       String?
  status      EquipmentStatus @default(AVAILABLE)  // 新欄位
  // ...其他欄位
}
```

### 2. 環境變數更新 (`.env`)

```bash
# 變更前
DATABASE_URL="file:./dev.db"

# 變更後
DATABASE_URL="postgresql://[用戶提供的連接字串]"
```

### 3. 程式碼變更摘要

#### API 路由更新
- `app/api/equipment/route.ts`：更新設備建立邏輯
- `app/api/admin/initialize/route.ts`：使用新的 enum 類型
- `app/api/admin/reset/route.ts`：使用新的 enum 類型
- `app/api/init/route.ts`：使用新的 enum 類型

#### 前端元件更新
- `components/equipment-select-dialog.tsx`：支援新狀態系統
- `lib/utils.ts`：新增狀態檢查函式
- `app/admin/equipment/page.tsx`：完整的狀態管理介面

## 🗂️ 檔案變更清單

### 已修改的檔案：
1. `prisma/schema.prisma` - 完全重寫，從 SQLite 改為 PostgreSQL
2. `.env` - 更新資料庫連接字串
3. `app/api/equipment/route.ts` - 設備狀態邏輯
4. `app/api/admin/initialize/route.ts` - 使用 EquipmentStatus enum
5. `app/api/admin/reset/route.ts` - 使用 EquipmentStatus enum
6. `app/api/init/route.ts` - 使用 EquipmentStatus enum
7. `components/equipment-select-dialog.tsx` - 狀態顯示邏輯
8. `lib/utils.ts` - 新增 canBookEquipment 函式
9. `app/admin/equipment/page.tsx` - 狀態管理介面

### 舊檔案 (保留作為參考)：
- `prisma/schema.dev.prisma` - SQLite 開發版本
- `prisma/dev.db` - SQLite 資料庫檔案

## 🎯 設備狀態系統

### 狀態定義：
- **AVAILABLE** (開放預約)：設備正常，可以預約
- **ASK_ADMIN** (請詢問管理員)：需要管理員確認才能預約
- **PREPARING** (籌備中)：設備準備中，暫時無法預約
- **MAINTENANCE** (維護中)：設備維護中，無法預約
- **UNAVAILABLE** (不可用)：設備故障或停用，無法預約

### 預約規則：
```typescript
function canBookEquipment(status: EquipmentStatus): boolean {
  return status === 'AVAILABLE' || status === 'ASK_ADMIN'
}
```

## 📝 執行的指令

### 遷移指令序列：
```bash
# 1. 推送新 schema 到 PostgreSQL
npx prisma db push

# 2. 重新生成 Prisma client
npx prisma generate

# 3. 驗證編譯
npm run build

# 4. 啟動開發伺服器
npm run dev
```

## ⚠️ 重要注意事項

### 資料庫識別：
- **開發環境**：如果使用 SQLite，使用 `prisma/schema.dev.prisma`
- **生產環境**：使用 `prisma/schema.prisma` (PostgreSQL)
- **當前狀態**：已遷移到 PostgreSQL

### 類型安全：
- 所有 API 路由都使用 TypeScript enum 類型
- Prisma client 已重新生成，包含所有新類型
- 前端元件使用型別安全的狀態檢查

### 資料遷移：
- ⚠️ **資料遺失**：從 SQLite 遷移到 PostgreSQL 時會遺失舊資料
- 🔄 **重新初始化**：使用 `/api/init` 端點重新建立基礎資料
- 🗃️ **備份**：SQLite 檔案已保留作為備份

## 🔍 驗證清單

### ✅ 已驗證項目：
- [x] Prisma schema 語法正確
- [x] PostgreSQL 連接成功
- [x] Enum 類型正確生成
- [x] 所有 API 路由編譯成功
- [x] 前端元件正常運作
- [x] 專案成功建構 (`npm run build`)
- [x] 開發伺服器正常啟動

### 🧪 測試項目：
- [x] 設備建立功能
- [x] 狀態變更功能
- [x] 預約流程
- [x] 手機響應式介面

## 📞 故障排除

### 常見問題：
1. **Prisma client 類型錯誤**：執行 `npx prisma generate`
2. **資料庫連接失敗**：檢查 `.env` 中的 `DATABASE_URL`
3. **編譯錯誤**：確認所有檔案都使用新的 enum 類型

### 回滾程序：
如需回滾到 SQLite：
1. 將 `prisma/schema.dev.prisma` 複製到 `prisma/schema.prisma`
2. 更新 `.env` 中的 `DATABASE_URL` 為 `"file:./dev.db"`
3. 執行 `npx prisma generate`

## 📊 效能改善

### PostgreSQL 優勢：
- 🚀 更好的併發處理
- 🔒 ACID 事務支援
- 📈 適合生產環境擴展
- 🎯 完整的 enum 類型支援

## 🏁 結論

資料庫遷移已成功完成，應用程式現在使用 PostgreSQL 作為主要資料庫，並實作了完整的設備狀態管理系統。所有功能都已驗證正常運作，準備部署到生產環境。

---
**記錄人員**：GitHub Copilot  
**最後更新**：2025年8月16日  
**狀態**：✅ 完成
