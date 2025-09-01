# 設備選擇對話框狀態顏色統一化

## 問題描述
設備選擇對話框中的設備狀態 Badge 顏色與首頁和管理頁面不一致。

### 修正前的問題：
- **設備選擇對話框**：使用硬編碼的 variant (`default`, `secondary`, `destructive`)
- **首頁和管理頁面**：使用統一的顏色配置 (`getStatusBadgeClass()`)

## 解決方案

### 統一使用 `getStatusBadgeClass()` 函式
所有頁面現在都使用相同的顏色配置：

```typescript
// 統一的狀態顏色配置 (lib/equipment-status.ts)
AVAILABLE: { color: 'bg-green-100 text-green-800' }      // 綠色
ASK_ADMIN: { color: 'bg-orange-100 text-orange-800' }   // 橙色  
PREPARING: { color: 'bg-blue-100 text-blue-800' }       // 藍色
MAINTENANCE: { color: 'bg-yellow-100 text-yellow-800' } // 黃色
UNAVAILABLE: { color: 'bg-red-100 text-red-800' }       // 紅色
```

### 修正內容

#### 1. 加入 `getStatusBadgeClass` 函式 import
**修正前：**
```typescript
import { EQUIPMENT_STATUS_CONFIG, getEquipmentStatusConfig, type EquipmentStatus } from '@/lib/equipment-status'
```

**修正後：**
```typescript
import { EQUIPMENT_STATUS_CONFIG, getEquipmentStatusConfig, getStatusBadgeClass, type EquipmentStatus } from '@/lib/equipment-status'
```

#### 2. 統一 Badge 顏色配置
**修正前：**
```tsx
<Badge 
  variant={
    eq.status === 'AVAILABLE' ? 'default' : 
    eq.status === 'ASK_ADMIN' ? 'secondary' : 
    'destructive'
  }
  className="text-xs shrink-0"
>
  {statusConfig.label}
</Badge>
```

**修正後：**
```tsx
<Badge 
  variant="outline"
  className={`text-xs shrink-0 ${getStatusBadgeClass(eq.status)}`}
>
  {statusConfig.label}
</Badge>
```

## 現在的統一顯示

### 所有頁面的設備狀態都顯示一致的顏色：
- ✅ **AVAILABLE** → 「開放預約」（綠色背景）
- ✅ **ASK_ADMIN** → 「請詢問管理員」（橙色背景）
- ✅ **PREPARING** → 「籌備中」（藍色背景）
- ✅ **MAINTENANCE** → 「維護中」（黃色背景）
- ✅ **UNAVAILABLE** → 「停用」（紅色背景）

## 統一化完成的頁面

- ✅ **首頁** (`/`) - 右側邊欄「設備狀態」區塊
- ✅ **設備管理頁面** (`/admin/equipment`) - 設備卡片的狀態 Badge
- ✅ **設備選擇對話框** (`equipment-select-dialog.tsx`) - 預約時的設備列表

## 技術優勢

1. **視覺一致性**：所有頁面使用相同的狀態顏色
2. **維護簡便**：顏色定義集中在 `equipment-status.ts`
3. **使用者體驗**：統一的顏色語言提升辨識度
4. **開發效率**：減少重複的顏色配置程式碼

現在「可預約」狀態在所有地方都顯示為綠色背景！🟢
