'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, isSameMonth, isWeekend, startOfWeek, endOfWeek, addWeeks, subWeeks, startOfDay, addDays, subDays } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, Grid3x3, LayoutGrid } from 'lucide-react'
import { BookingDialog } from './booking-dialog'
import { BookingDetailsDialog } from './booking-details-dialog'
import { EquipmentSelectDialog } from './equipment-select-dialog'
import { isPublicHoliday, isBookingAvailable } from '@/lib/utils'
import { type EquipmentStatus } from '@/lib/equipment-status'

interface Equipment {
  id: string
  name: string
  description?: string
  location?: string
  color?: string // 新增顏色欄位
  status: EquipmentStatus // 新增狀態欄位
}

interface User {
  id: string
  name?: string
  email: string
}

interface Booking {
  id: string
  startTime: Date
  endTime: Date
  equipment: Equipment
  user?: User
  guestName?: string
  purpose: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  rejectionReason?: string
  createdAt?: Date
}

type ViewType = 'month' | 'week' | 'day'

// 取得設備顏色 - 使用資料庫顏色或預設顏色
function getEquipmentColor(equipment: Equipment | { id: string; color?: string }, isLight: boolean = false) {
  const color = 'color' in equipment ? equipment.color : undefined
  
  if (color) {
    if (isLight) {
      // 將 hex 顏色轉為淺色背景
      return `bg-opacity-10 border-opacity-30 text-opacity-80`
    }
    return '' // 將直接在 style 中使用 backgroundColor
  }
  
  // 預設顏色映射
  const EQUIPMENT_COLORS = {
    'cryo-1': 'bg-blue-500',
    'cryo-2': 'bg-green-500', 
    'cryo-3': 'bg-purple-500',
    'cryo-4': 'bg-orange-500',
  } as const

  const EQUIPMENT_LIGHT_COLORS = {
    'cryo-1': 'bg-blue-100 text-blue-800 border-blue-200',
    'cryo-2': 'bg-green-100 text-green-800 border-green-200',
    'cryo-3': 'bg-purple-100 text-purple-800 border-purple-200', 
    'cryo-4': 'bg-orange-100 text-orange-800 border-orange-200',
  } as const

  const colors = isLight ? EQUIPMENT_LIGHT_COLORS : EQUIPMENT_COLORS
  return colors[equipment.id as keyof typeof colors] || (isLight ? 'bg-gray-100 text-gray-800 border-gray-200' : 'bg-gray-500')
}

// 將 hex 顏色轉為 rgba 格式
function hexToRgba(hex: string, alpha: number = 1): string {
  if (!hex) return 'rgba(156, 163, 175, 1)' // 預設灰色
  
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16) 
  const b = parseInt(hex.slice(5, 7), 16)
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewType, setViewType] = useState<ViewType>('month')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  const [showEquipmentSelect, setShowEquipmentSelect] = useState(false)
  const [showBookingDialog, setShowBookingDialog] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showBookingDetails, setShowBookingDetails] = useState(false)

  useEffect(() => {
    fetchEquipment()
    fetchBookings()
  }, [currentDate, viewType])

  const fetchEquipment = async () => {
    try {
      const response = await fetch('/api/equipment')
      if (response.ok) {
        const data = await response.json()
        setEquipment(data)
      }
    } catch (error) {
      console.error('取得設備列表失敗:', error)
    }
  }

  const fetchBookings = async () => {
    try {
      // 獲取所有預約（包含所有狀態），讓使用者能看到完整的預約情況
      const response = await fetch('/api/bookings?public=true&status=all')
      if (response.ok) {
        const data = await response.json()
        const processedBookings = data.map((booking: any) => ({
          ...booking,
          startTime: new Date(booking.startTime),
          endTime: new Date(booking.endTime),
        }))
        setBookings(processedBookings)
      }
    } catch (error) {
      console.error('取得預約列表失敗:', error)
    }
  }

  // 根據視圖類型獲取日期範圍
  const getDateRange = () => {
    switch (viewType) {
      case 'month':
        const monthStart = startOfMonth(currentDate)
        const monthEnd = endOfMonth(currentDate)
        const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
        const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
        return { start: calendarStart, end: calendarEnd }
      
      case 'week':
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 })
        return { start: weekStart, end: weekEnd }
      
      case 'day':
        const dayStart = startOfDay(currentDate)
        const dayEnd = startOfDay(currentDate)
        return { start: dayStart, end: dayEnd }
      
      default:
        return { start: currentDate, end: currentDate }
    }
  }

  const dateRange = getDateRange()
  const daysInView = eachDayOfInterval({ start: dateRange.start, end: dateRange.end })

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  
  // 取得完整的日曆週期 (包含上個月末和下個月初的日期)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }) // 0 = 星期日開始
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
  const daysInCalendar = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => 
      isSameDay(booking.startTime, date) ||
      (booking.startTime <= date && booking.endTime >= date)
    )
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setShowEquipmentSelect(true)
  }

  const handleEquipmentSelected = (eq: Equipment) => {
    setSelectedEquipment(eq)
    setShowEquipmentSelect(false)
    setShowBookingDialog(true)
  }

  const handleBookingClick = (booking: Booking, e: React.MouseEvent) => {
    e.stopPropagation() // 防止觸發日期點擊
    setSelectedBooking(booking)
    setShowBookingDetails(true)
  }

  const navigatePrevious = () => {
    switch (viewType) {
      case 'month':
        setCurrentDate(subMonths(currentDate, 1))
        break
      case 'week':
        setCurrentDate(subWeeks(currentDate, 1))
        break
      case 'day':
        setCurrentDate(subDays(currentDate, 1))
        break
    }
  }

  const navigateNext = () => {
    switch (viewType) {
      case 'month':
        setCurrentDate(addMonths(currentDate, 1))
        break
      case 'week':
        setCurrentDate(addWeeks(currentDate, 1))
        break
      case 'day':
        setCurrentDate(addDays(currentDate, 1))
        break
    }
  }

  const getViewTitle = () => {
    switch (viewType) {
      case 'month':
        return format(currentDate, 'yyyy年 MMMM', { locale: zhTW })
      case 'week':
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 })
        return `${format(weekStart, 'MM月dd日', { locale: zhTW })} - ${format(weekEnd, 'MM月dd日', { locale: zhTW })}`
      case 'day':
        return format(currentDate, 'yyyy年MM月dd日 EEEE', { locale: zhTW })
      default:
        return ''
    }
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* 視圖選擇和導航 */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* 視圖切換按鈕 */}
        <div className="flex items-center gap-1 lg:gap-2">
          <Button 
            variant={viewType === 'month' ? 'default' : 'outline'} 
            size="sm"
            className="flex-1 lg:flex-initial text-xs lg:text-sm px-2 lg:px-4"
            onClick={() => setViewType('month')}
          >
            <LayoutGrid className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
            月
          </Button>
          <Button 
            variant={viewType === 'week' ? 'default' : 'outline'} 
            size="sm"
            className="flex-1 lg:flex-initial text-xs lg:text-sm px-2 lg:px-4"
            onClick={() => setViewType('week')}
          >
            <Grid3x3 className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
            週
          </Button>
          <Button 
            variant={viewType === 'day' ? 'default' : 'outline'} 
            size="sm"
            className="flex-1 lg:flex-initial text-xs lg:text-sm px-2 lg:px-4"
            onClick={() => setViewType('day')}
          >
            <CalendarIcon className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
            日
          </Button>
        </div>

        {/* 日期導航 */}
        <div className="flex items-center justify-center gap-2 lg:gap-4">
          <Button variant="outline" size="sm" onClick={navigatePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg lg:text-xl font-semibold min-w-0 text-center px-2">
            {getViewTitle()}
          </h2>
          <Button variant="outline" size="sm" onClick={navigateNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 設備顏色圖例 */}
      <div className="p-3 lg:p-4 bg-gray-50 rounded-lg">
        <div className="text-xs lg:text-sm font-medium text-gray-700 mb-2 lg:mb-0 lg:inline">設備圖例：</div>
        
        {/* 設備圖例 */}
        <div className="flex flex-wrap gap-2 lg:gap-4 mb-2 lg:mb-0 lg:inline-flex lg:ml-2">
          {equipment.map((eq) => (
            <div key={eq.id} className="flex items-center gap-1 lg:gap-2">
              <div 
                className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full border"
                style={{ 
                  backgroundColor: eq.color || '#9CA3AF',
                  borderColor: eq.color ? hexToRgba(eq.color, 0.3) : '#D1D5DB'
                }}
              ></div>
              <span className="text-xs lg:text-sm text-gray-700">{eq.name}</span>
            </div>
          ))}
        </div>
        
        {/* 狀態圖例 */}
        <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-xs text-gray-600 lg:ml-4 lg:inline-flex">
          <div className="flex items-center gap-1">
            <span className="text-green-600">●</span> 已核准
          </div>
          <div className="flex items-center gap-1">
            <span className="text-orange-600">●</span> 待審核
          </div>
          <div className="flex items-center gap-1">
            <span className="text-red-600">●</span> 已拒絕
          </div>
        </div>
      </div>

      {/* 日曆網格 */}
      <div className={`grid gap-0.5 lg:gap-1 ${viewType === 'day' ? 'grid-cols-1' : 'grid-cols-7'}`}>
        {/* 星期標頭 - 只在月視圖和週視圖顯示 */}
        {viewType !== 'day' && ['日', '一', '二', '三', '四', '五', '六'].map((day) => (
          <div key={day} className="p-1 lg:p-2 text-center font-medium text-gray-500 text-xs lg:text-sm">
            {day}
          </div>
        ))}

        {/* 日期網格 */}
        {daysInView.map((date) => {
          const dayBookings = getBookingsForDate(date)
          const isSelected = selectedDate && isSameDay(date, selectedDate)
          const isCurrentMonth = viewType === 'month' ? isSameMonth(date, currentDate) : true
          const isNotAvailable = !isBookingAvailable(date)

          return (
            <div
              key={date.toString()}
              className={`${
                viewType === 'day' 
                  ? 'min-h-[300px] lg:min-h-[400px]' 
                  : 'min-h-[80px] lg:min-h-[100px]'
              } p-1 lg:p-2 border cursor-pointer transition-colors ${
                isSelected ? 'bg-blue-100 border-blue-300' : 'border-gray-200'
              } ${
                isToday(date) ? 'bg-blue-50' : ''
              } ${
                !isCurrentMonth ? 'text-gray-400 bg-gray-50' : ''
              } ${
                isNotAvailable ? 'bg-red-50 cursor-not-allowed' : 'hover:bg-gray-50'
              }`}
              onClick={() => !isNotAvailable && handleDateClick(date)}
            >
              <div className={`font-medium ${
                viewType === 'day' 
                  ? 'text-base lg:text-lg mb-2 lg:mb-4' 
                  : 'text-xs lg:text-sm'
              }`}>
                {viewType === 'day' 
                  ? format(date, 'MM月dd日 EEEE', { locale: zhTW })
                  : format(date, 'd')
                }
              </div>
              
              {/* 預約資訊 */}
              <div className={`mt-1 space-y-0.5 lg:space-y-1 ${viewType === 'day' ? 'lg:space-y-2' : ''}`}>
                {dayBookings.slice(0, viewType === 'day' ? 10 : (viewType === 'month' ? 2 : 3)).map((booking) => (
                  <div
                    key={booking.id}
                    className={`${
                      viewType === 'day' 
                        ? 'text-xs lg:text-sm p-1.5 lg:p-2' 
                        : 'text-xs p-1'
                    } rounded border cursor-pointer hover:opacity-80 transition-opacity ${
                      booking.status === 'REJECTED' ? 'opacity-60' : ''
                    }`}
                    style={{
                      backgroundColor: booking.equipment.color ? hexToRgba(booking.equipment.color, 0.1) : 'rgba(243, 244, 246, 1)',
                      borderColor: booking.equipment.color ? hexToRgba(booking.equipment.color, 0.3) : 'rgba(209, 213, 219, 1)',
                      color: booking.equipment.color || '#374151'
                    }}
                    title={`${booking.equipment.name} - ${format(booking.startTime, 'HH:mm')} (${booking.status === 'APPROVED' ? '已核准' : booking.status === 'PENDING' ? '待審核' : '已拒絕'})`}
                    onClick={(e) => handleBookingClick(booking, e)}
                  >
                    <div className="flex items-center gap-1 truncate">
                      <div 
                        className={`${
                          viewType === 'day' 
                            ? 'w-2.5 h-2.5 lg:w-3 lg:h-3' 
                            : 'w-1.5 h-1.5 lg:w-2 lg:h-2'
                        } rounded-full border flex-shrink-0`}
                        style={{ 
                          backgroundColor: booking.equipment.color || '#9CA3AF',
                          borderColor: booking.equipment.color ? hexToRgba(booking.equipment.color, 0.5) : '#D1D5DB'
                        }}
                      ></div>
                      <span className="truncate font-medium text-xs lg:text-sm">
                        {viewType === 'month' ? booking.equipment.name.substring(0, 4) : booking.equipment.name}
                      </span>
                    </div>
                    <div className={`flex items-center gap-1 text-xs opacity-75 ${viewType === 'day' ? 'lg:text-sm' : ''}`}>
                      <Clock className={`${
                        viewType === 'day' 
                          ? 'h-2.5 w-2.5 lg:h-3 lg:w-3' 
                          : 'h-2 w-2 lg:h-2.5 lg:w-2.5'
                      } flex-shrink-0`} />
                      <span className="truncate">
                        {viewType === 'day' 
                          ? `${format(booking.startTime, 'HH:mm')} - ${format(booking.endTime, 'HH:mm')}`
                          : format(booking.startTime, 'HH:mm')
                        }
                      </span>
                      <span className={`${
                        viewType === 'day' ? 'text-xs lg:text-sm' : 'text-xs'
                      } font-medium flex-shrink-0 ${
                        booking.status === 'PENDING' ? 'text-orange-600' :
                        booking.status === 'APPROVED' ? 'text-green-600' :
                        'text-red-600'
                      }`}>
                        {booking.status === 'PENDING' && '待審'}
                        {booking.status === 'APPROVED' && '已核准'}
                        {booking.status === 'REJECTED' && '已拒絕'}
                      </span>
                    </div>
                    {viewType === 'day' && (
                      <div className="text-xs text-gray-600 mt-1 truncate">
                        {booking.user ? booking.user.name || booking.user.email : booking.guestName}
                      </div>
                    )}
                  </div>
                ))}
                {dayBookings.length > (viewType === 'day' ? 10 : (viewType === 'month' ? 2 : 3)) && (
                  <div className={`${
                    viewType === 'day' ? 'text-xs lg:text-sm' : 'text-xs'
                  } text-gray-500 p-1`}>
                    +{dayBookings.length - (viewType === 'day' ? 10 : (viewType === 'month' ? 2 : 3))} 更多
                  </div>
                )}
              </div>

              {/* 不可預約日期標示 */}
              {isNotAvailable && (
                <div className={`${
                  viewType === 'day' ? 'text-xs lg:text-sm' : 'text-xs'
                } text-red-500 mt-1`}>
                  不開放
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 設備選擇對話框 */}
      {showEquipmentSelect && selectedDate && (
        <EquipmentSelectDialog
          equipment={equipment}
          selectedDate={selectedDate}
          open={showEquipmentSelect}
          onOpenChange={setShowEquipmentSelect}
          onEquipmentSelected={handleEquipmentSelected}
        />
      )}

      {/* 預約對話框 */}
      {showBookingDialog && selectedEquipment && selectedDate && (
        <BookingDialog
          equipment={selectedEquipment}
          selectedDate={selectedDate}
          open={showBookingDialog}
          onOpenChange={setShowBookingDialog}
          onBookingCreated={() => {
            fetchBookings()
            setShowBookingDialog(false)
          }}
        />
      )}

      {/* 預約詳情對話框 */}
      <BookingDetailsDialog
        booking={selectedBooking}
        open={showBookingDetails}
        onOpenChange={setShowBookingDetails}
      />
    </div>
  )
}
