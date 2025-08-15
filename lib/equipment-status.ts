// 設備狀態管理輔助函式

export type EquipmentStatus = 'AVAILABLE' | 'ASK_ADMIN' | 'PREPARING' | 'MAINTENANCE' | 'UNAVAILABLE'

export const EQUIPMENT_STATUS_CONFIG = {
  AVAILABLE: {
    label: '開放預約',
    color: 'bg-green-100 text-green-800',
    icon: '🟢',
    canBook: true,
    requiresApproval: false,
    description: '設備正常運作，可直接預約'
  },
  ASK_ADMIN: {
    label: '請詢問管理員',
    color: 'bg-orange-100 text-orange-800', 
    icon: '🟠',
    canBook: true,
    requiresApproval: true,
    description: '設備可使用，但需管理員確認'
  },
  PREPARING: {
    label: '籌備中',
    color: 'bg-blue-100 text-blue-800',
    icon: '🔵', 
    canBook: false,
    requiresApproval: false,
    description: '設備正在準備中，暫不開放'
  },
  MAINTENANCE: {
    label: '維護中',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '🟡',
    canBook: false, 
    requiresApproval: false,
    description: '設備維護中，暫停預約'
  },
  UNAVAILABLE: {
    label: '停用',
    color: 'bg-red-100 text-red-800',
    icon: '🔴',
    canBook: false,
    requiresApproval: false, 
    description: '設備無法使用'
  }
} as const

export function getEquipmentStatusConfig(status: EquipmentStatus) {
  return EQUIPMENT_STATUS_CONFIG[status]
}

export function canBookEquipment(status: EquipmentStatus): boolean {
  return getEquipmentStatusConfig(status).canBook
}

export function requiresAdminApproval(status: EquipmentStatus): boolean {
  return getEquipmentStatusConfig(status).requiresApproval
}

export function getStatusBadgeClass(status: EquipmentStatus): string {
  return getEquipmentStatusConfig(status).color
}

export function getStatusLabel(status: EquipmentStatus): string {
  return getEquipmentStatusConfig(status).label
}
