# 資料庫設定指南 (Database Configuration Guide)

## 🔧 當前資料庫設定

### ✅ 生產環境 (當前使用)
```yaml
資料庫類型: PostgreSQL
設定檔案: prisma/schema.prisma
連接方式: 環境變數 DATABASE_URL
狀態: 🟢 活躍使用中
```

### 📋 完整設定檔案內容

#### `prisma/schema.prisma` (PostgreSQL)
```prisma
// 生產環境 Prisma Schema (PostgreSQL)
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Enums (PostgreSQL 支援)
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

// Models
model User {
  id       String @id @default(cuid())
  email    String @unique
  name     String?
  role     Role   @default(USER)
  password String?
  
  // NextAuth 相關
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  
  // 業務相關
  bookings Booking[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Equipment {
  id          String @id @default(cuid())
  name        String
  description String?
  location    String?
  color       String?
  status      EquipmentStatus @default(AVAILABLE)  // 使用 enum
  
  bookings Booking[]
  timeSlots TimeSlot[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Booking {
  id          String @id @default(cuid())
  equipmentId String
  userId      String
  date        DateTime
  startTime   String
  endTime     String
  purpose     String?
  status      BookingStatus @default(PENDING)  // 使用 enum
  
  equipment Equipment @relation(fields: [equipmentId], references: [id])
  user      User      @relation(fields: [userId], references: [id])
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// ... 其他 models
```

#### `.env` 檔案範例
```bash
# PostgreSQL 資料庫連接
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"

# NextAuth 設定
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# 其他環境變數
NODE_ENV="development"
```

## 🔄 資料庫遷移歷程

### 階段 1：SQLite 開發版本 (已淘汰)
```yaml
檔案: prisma/schema.dev.prisma
Provider: sqlite
URL: file:./dev.db
狀態: ❌ 已停用 (保留作為備份)
```

### 階段 2：PostgreSQL 生產版本 (目前)
```yaml
檔案: prisma/schema.prisma  
Provider: postgresql
URL: env("DATABASE_URL")
狀態: ✅ 使用中
```

## 🎯 Enum 設計說明

### EquipmentStatus (設備狀態)
```typescript
enum EquipmentStatus {
  AVAILABLE     // 開放預約 - 綠色徽章 🟢
  ASK_ADMIN     // 請詢問管理員 - 黃色徽章 🟡  
  PREPARING     // 籌備中 - 藍色徽章 🔵
  MAINTENANCE   // 維護中 - 紅色徽章 🔴
  UNAVAILABLE   // 不可用 - 灰色徽章 ⚫
}
```

### 預約邏輯
```typescript
// lib/utils.ts
export function canBookEquipment(status: EquipmentStatus): boolean {
  return status === 'AVAILABLE' || status === 'ASK_ADMIN'
}

// 可預約: AVAILABLE, ASK_ADMIN
// 不可預約: PREPARING, MAINTENANCE, UNAVAILABLE
```

## 🛠️ 開發工具指令

### Prisma 常用指令
```bash
# 生成 client (必須執行)
npx prisma generate

# 推送 schema 到資料庫
npx prisma db push

# 開啟資料庫管理介面
npx prisma studio

# 檢查資料庫狀態
npx prisma db pull

# 重設資料庫
npx prisma db push --force-reset
```

### 除錯指令
```bash
# 檢查連接
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.$connect().then(() => console.log('Connected')).catch(console.error)"

# 檢查 enum 生成
node -e "const { EquipmentStatus } = require('@prisma/client'); console.log(EquipmentStatus);"
```

## 🔐 安全性設定

### 資料庫權限
```sql
-- PostgreSQL 使用者權限範例
GRANT CONNECT ON DATABASE your_database TO your_user;
GRANT USAGE ON SCHEMA public TO your_user;
GRANT CREATE ON SCHEMA public TO your_user;
GRANT ALL ON ALL TABLES IN SCHEMA public TO your_user;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO your_user;
```

### 連接字串安全
```bash
# 使用環境變數
DATABASE_URL="postgresql://user:pass@host:5432/db"

# 不要在程式碼中硬編碼
# ❌ 錯誤做法
# const url = "postgresql://user:pass@host:5432/db"

# ✅ 正確做法  
# const url = process.env.DATABASE_URL
```

## 📊 效能優化

### 索引建議
```sql
-- 建議的索引
CREATE INDEX idx_equipment_status ON "Equipment"("status");
CREATE INDEX idx_booking_date ON "Booking"("date");
CREATE INDEX idx_booking_equipment ON "Booking"("equipmentId");
CREATE INDEX idx_user_email ON "User"("email");
```

### 查詢優化
```typescript
// 使用 select 限制欄位
const equipment = await prisma.equipment.findMany({
  select: {
    id: true,
    name: true,
    status: true,
    color: true,
  }
})

// 使用 where 過濾
const availableEquipment = await prisma.equipment.findMany({
  where: {
    status: {
      in: ['AVAILABLE', 'ASK_ADMIN']
    }
  }
})
```

## 🔄 備份與還原

### 備份策略
```bash
# PostgreSQL 備份
pg_dump -h host -U user -d database > backup.sql

# 還原
psql -h host -U user -d database < backup.sql
```

### 開發環境重設
```bash
# 重設並重新建立
npx prisma db push --force-reset

# 重新初始化資料
curl http://localhost:3000/api/init
```

## 🚨 常見錯誤解決

### 1. "Module '@prisma/client' has no exported member 'EquipmentStatus'"
```bash
# 解決方案
npx prisma generate
```

### 2. "Environment variable not found: DATABASE_URL"
```bash
# 檢查 .env 檔案
cat .env | grep DATABASE_URL
```

### 3. "Can't reach database server"
```bash
# 檢查連接字串格式
# postgresql://user:password@host:port/database
```

### 4. Schema 同步問題
```bash
# 強制同步
npx prisma db push --force-reset
npx prisma generate
```

## 📋 部署檢查清單

### Vercel 部署
- [ ] 設定 `DATABASE_URL` 環境變數
- [ ] 設定 `NEXTAUTH_SECRET` 環境變數  
- [ ] 設定 `NEXTAUTH_URL` 環境變數
- [ ] 確認 PostgreSQL 服務可用
- [ ] 執行 `npx prisma db push`

### 自主部署
- [ ] 安裝 Node.js 18+
- [ ] 安裝 PostgreSQL 
- [ ] 設定環境變數
- [ ] 執行 `npm install`
- [ ] 執行 `npx prisma generate`
- [ ] 執行 `npx prisma db push`
- [ ] 執行 `npm run build`

---
**重要提醒**：始終使用 PostgreSQL 設定，SQLite 已淘汰！  
**最後更新**：2025年8月16日
