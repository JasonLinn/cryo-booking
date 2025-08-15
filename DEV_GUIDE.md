# 開發環境啟動指南

## 首次設定

1. 安裝相依套件
```bash
npm install
```

2. 設定環境變數 (複製 .env.example 為 .env.local 並修改設定)
```bash
copy .env.example .env.local
```

3. 如果使用本地 PostgreSQL，請先建立資料庫
```sql
CREATE DATABASE cryo_booking;
```

4. 推送資料庫 schema
```bash
npm run db:push
```

5. 建立種子資料
```bash
npm run db:seed
```

## 日常開發

啟動開發伺服器：
```bash
npm run dev
```

開啟瀏覽器前往：http://localhost:3000

## 測試帳號

- 管理員：admin@localhost (密碼：admin123)
- 一般使用者：user@example.com (密碼：user123)

## 可用指令

- `npm run dev` - 啟動開發伺服器
- `npm run build` - 建構生產版本
- `npm run start` - 啟動生產伺服器
- `npm run db:push` - 推送資料庫 schema
- `npm run db:studio` - 開啟 Prisma Studio (資料庫管理介面)
- `npm run db:seed` - 建立種子資料

## 資料庫管理

檢視資料庫內容：
```bash
npm run db:studio
```

重置資料庫 (危險操作)：
```bash
npm run db:push -- --force-reset
npm run db:seed
```
