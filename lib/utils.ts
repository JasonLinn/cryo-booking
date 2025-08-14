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

// 檢查是否為國定假日
export function isPublicHoliday(date: Date): boolean {
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // getMonth() returns 0-11
  const day = date.getDate()
  
  // 台灣國定假日 (2025年為例，實際使用時可以接 API 或更完整的假日資料)
  const holidays = [
    // 元旦
    { month: 1, day: 1 },
    // 春節假期 (2025年1月29日-2月2日)
    { month: 1, day: 29 }, { month: 1, day: 30 }, { month: 1, day: 31 },
    { month: 2, day: 1 }, { month: 2, day: 2 },
    // 和平紀念日
    { month: 2, day: 28 },
    // 兒童節/清明節 (2025年4月4日)
    { month: 4, day: 4 },
    // 勞動節
    { month: 5, day: 1 },
    // 端午節 (2025年5月31日)
    { month: 5, day: 31 },
    // 中秋節 (2025年10月6日)
    { month: 10, day: 6 },
    // 國慶日
    { month: 10, day: 10 },
  ]
  
  return holidays.some(holiday => holiday.month === month && holiday.day === day)
}

// 檢查日期是否可以預約 (非週末且非國定假日)
export function isBookingAvailable(date: Date): boolean {
  const day = date.getDay()
  const isWeekendDay = day === 0 || day === 6 // Sunday = 0, Saturday = 6
  return !isWeekendDay && !isPublicHoliday(date)
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
