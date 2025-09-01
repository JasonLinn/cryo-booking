# 設備狀態顯示統一化修正

## 問題描述
首頁和管理頁面的設備狀態文字顯示不一致：

### 修正前的問題：
- **首頁**：正確使用 `getEquipmentStatusConfig()` 顯示「開放預約」、「停用」等
- **設備管理頁面**：硬編碼顯示「可預約」、「不可預約」等不一致的文字

## 解決方案

### 統一的狀態定義 (`lib/equipment-status.ts`)
```typescript
AVAILABLE: { label: '開放預約' }      // 不是「可預約」
ASK_ADMIN: { label: '請詢問管理員' }
PREPARING: { label: '籌備中' }
MAINTENANCE: { label: '維護中' }
UNAVAILABLE: { label: '停用' }        // 不是「不可預約」
```

### 修正內容

#### 1. 設備管理頁面的下拉選單選項
**修正前：**
```html
<option value="AVAILABLE">可預約</option>
<option value="UNAVAILABLE">不可預約</option>
```

**修正後：**
```html
<option value="AVAILABLE">開放預約</option>
<option value="UNAVAILABLE">停用</option>
```

#### 2. 設備卡片的狀態顯示
**修正前：**
```typescript
// 硬編碼的狀態文字
{eq.status === 'AVAILABLE' ? '可預約' :
 eq.status === 'ASK_ADMIN' ? '請詢問管理員' :
 eq.status === 'PREPARING' ? '籌備中' :
 eq.status === 'MAINTENANCE' ? '維護中' :
 '不可預約'}
```

**修正後：**
```typescript
// 使用統一的狀態配置函式
{getStatusLabel(eq.status)}
```

#### 3. Badge 顏色配置
**修正前：**
```typescript
// 手動設定的 variant
variant={eq.status === 'AVAILABLE' ? 'default' : 
        eq.status === 'ASK_ADMIN' ? 'secondary' : 'destructive'}
```

**修正後：**
```typescript
// 使用統一的顏色配置
variant="outline"
className={getStatusBadgeClass(eq.status)}
```

## 現在的統一顯示

### 所有頁面都會顯示：
- ✅ **AVAILABLE** → 「開放預約」（綠色）
- ✅ **ASK_ADMIN** → 「請詢問管理員」（橙色）
- ✅ **PREPARING** → 「籌備中」（藍色）
- ✅ **MAINTENANCE** → 「維護中」（黃色）
- ✅ **UNAVAILABLE** → 「停用」（紅色）

### 特殊狀態顯示（僅首頁）：
- 🔄 **使用中** → 當設備有進行中的預約時顯示（黃色）

## 技術優勢

1. **一致性**：所有頁面使用相同的狀態文字和顏色
2. **維護性**：狀態定義集中在 `equipment-status.ts`
3. **擴展性**：新增狀態只需修改一個檔案
4. **重用性**：狀態配置函式可在任何地方使用

## 修正檔案

- ✅ `app/admin/equipment/page.tsx` - 更新選單選項和卡片顯示
- ✅ `lib/equipment-status.ts` - 原本就正確（基準配置）
- ✅ `app/page.tsx` - 原本就正確（使用統一函式）

## 測試確認

請檢查以下頁面確認狀態顯示一致：

1. **首頁** (`/`) - 右側邊欄「設備狀態」區塊
2. **設備管理頁面** (`/admin/equipment`) - 設備卡片的狀態 Badge
3. **編輯設備對話框** - 狀態下拉選單的選項文字

所有位置現在都應該顯示統一的狀態文字。
