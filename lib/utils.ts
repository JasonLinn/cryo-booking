import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 檢查是否為工作日
export function isWeekday(date: Date): boolean {
  const day = date.getDay()
  return day >= 1 && day <= 5 // Monday to Friday
}

// 檢查時間是否在允許的時段內
export function isTimeSlotAvailable(
  date: Date,
  hour: number,
  timeSlots: Array<{
    dayOfWeek: number
    startHour: number
    endHour: number
    isActive: boolean
  }>
): boolean {
  const dayOfWeek = date.getDay()
  
  return timeSlots.some(slot => 
    slot.isActive &&
    slot.dayOfWeek === dayOfWeek &&
    hour >= slot.startHour &&
    hour < slot.endHour
  )
}

// 格式化日期時間
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Taipei'
  }).format(date)
}

// 格式化日期
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Taipei'
  }).format(date)
}

// 檢查預約時間衝突
export function hasTimeConflict(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean {
  return start1 < end2 && start2 < end1
}
