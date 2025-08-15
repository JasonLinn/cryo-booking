# 部署檢查清單 (Deployment Checklist)

## 🚀 準備部署到生產環境

### ✅ 部署前檢查清單

#### 📁 檔案檢查
- [ ] 確認使用正確的 `prisma/schema.prisma` (PostgreSQL)
- [ ] 確認 `.env` 設定正確
- [ ] 確認 `package.json` 包含正確的 scripts
- [ ] 確認 `next.config.js` 設定適合生產環境

#### 🗃️ 資料庫檢查
- [ ] PostgreSQL 資料庫已建立
- [ ] `DATABASE_URL` 連接字串正確
- [ ] 資料庫權限設定正確
- [ ] 執行過 `npx prisma db push`
- [ ] 執行過 `npx prisma generate`

#### 🔐 安全性檢查  
- [ ] `NEXTAUTH_SECRET` 使用強隨機字串
- [ ] 所有敏感資訊都在環境變數中
- [ ] 生產環境的 `NEXTAUTH_URL` 設定正確
- [ ] 移除所有測試/開發用的硬編碼值

#### 📧 功能檢查
- [ ] 電子郵件服務設定正確
- [ ] 測試預約流程完整性
- [ ] 測試管理員功能
- [ ] 測試響應式設計

## 🌐 Vercel 部署步驟

### 1. 準備 GitHub Repository
```bash
# 確保所有變更都已提交
git add .
git commit -m "準備部署到生產環境"
git push origin main
```

### 2. 連接 Vercel
1. 前往 [vercel.com](https://vercel.com)
2. 使用 GitHub 帳號登入
3. 點擊 "New Project"
4. 選擇 `cryo-booking` repository
5. 點擊 "Import"

### 3. 設定環境變數
在 Vercel 專案設定中新增以下環境變數：

```bash
# 必需的環境變數
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-app.vercel.app"

# 電子郵件設定
RESEND_API_KEY="your-resend-key"
FROM_EMAIL="noreply@your-domain.com"

# 管理員設定
ADMIN_EMAIL="admin@your-domain.com"
```

### 4. 建構設定
Vercel 會自動偵測 Next.js 專案，但確認以下設定：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

### 5. 部署
1. 點擊 "Deploy"
2. 等待建構完成
3. 測試部署的應用程式

## 🔧 自主部署步驟

### 1. 伺服器環境準備
```bash
# 安裝 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安裝 PM2 (程序管理)
npm install -g pm2

# 安裝 PostgreSQL
sudo apt-get install postgresql postgresql-contrib
```

### 2. 專案部署
```bash
# 克隆專案
git clone <your-repo-url>
cd cryo-booking

# 安裝相依套件
npm install

# 設定環境變數
cp .env.example .env
# 編輯 .env 檔案

# 設定資料庫
npx prisma generate
npx prisma db push

# 建構專案
npm run build

# 使用 PM2 啟動
pm2 start npm --name "cryo-booking" -- start
```

### 3. Nginx 設定 (可選)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📋 部署後檢查

### ✅ 功能測試
- [ ] 網站可以正常開啟
- [ ] 首頁日曆顯示正常
- [ ] 可以成功登入
- [ ] 預約流程完整
- [ ] 管理員功能正常
- [ ] 手機版面正常

### ✅ 效能檢查
- [ ] 頁面載入速度 < 3秒
- [ ] 資料庫查詢效能正常
- [ ] 圖片載入正常
- [ ] API 回應時間合理

### ✅ 安全性檢查
- [ ] HTTPS 憑證正常
- [ ] 沒有敏感資訊暴露
- [ ] 身份認證功能正常
- [ ] 權限控制正確

## 🔄 CI/CD 設定 (進階)

### GitHub Actions 範例
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Generate Prisma Client
      run: npx prisma generate
      
    - name: Build project
      run: npm run build
      
    - name: Deploy to Vercel
      uses: vercel/action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 🆘 部署故障排除

### 常見問題

#### 1. 建構失敗
```bash
# 檢查 Node.js 版本
node --version  # 應該是 18+

# 清除快取重新建構
rm -rf .next node_modules
npm install
npm run build
```

#### 2. 資料庫連接失敗
```bash
# 測試連接
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect()
  .then(() => console.log('Database connected'))
  .catch(console.error);
"
```

#### 3. 環境變數問題
```bash
# 檢查環境變數
echo $DATABASE_URL
echo $NEXTAUTH_SECRET
```

#### 4. Prisma 問題
```bash
# 重新生成 client
npx prisma generate

# 重新同步資料庫
npx prisma db push
```

## 📞 支援資源

### 文件
- [Vercel 部署指南](https://vercel.com/docs)
- [Next.js 部署](https://nextjs.org/docs/deployment)
- [Prisma 部署](https://www.prisma.io/docs/guides/deployment)

### 相關檔案
- `MIGRATION_LOG.md` - 資料庫遷移記錄
- `PROJECT_CONFIG.md` - 專案設定說明
- `QUICK_START.md` - 快速開始指南
- `DATABASE_CONFIG.md` - 資料庫設定詳情

---
**部署完成後，記得更新此檢查清單！**  
**最後更新**：2025年8月16日
