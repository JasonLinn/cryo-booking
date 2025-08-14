@echo off
echo 低溫設備預約系統 - 快速啟動
echo ========================================
echo.

REM 檢查是否有 .env.local 檔案
if not exist .env.local (
    echo 正在複製環境變數範例檔案...
    copy .env.example .env.local
    echo.
    echo 請編輯 .env.local 檔案並設定資料庫連線資訊
    echo 然後重新執行此腳本
    pause
    exit /b
)

echo 正在安裝相依套件...
call npm install
if %errorlevel% neq 0 (
    echo 套件安裝失敗！
    pause
    exit /b
)

echo.
echo 正在初始化資料庫...
call npm run db:push
if %errorlevel% neq 0 (
    echo 資料庫初始化失敗！請檢查資料庫連線設定
    pause
    exit /b
)

echo.
echo 正在建立種子資料...
call npm run db:seed
if %errorlevel% neq 0 (
    echo 種子資料建立失敗！
    pause
    exit /b
)

echo.
echo ========================================
echo 設定完成！正在啟動開發伺服器...
echo 請開啟瀏覽器前往: http://localhost:3000
echo.
echo 測試帳號:
echo   管理員: admin@example.com
echo   使用者: user@example.com
echo ========================================
echo.

call npm run dev
