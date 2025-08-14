'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, isSameMonth, isWeekend } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { BookingDialog } from './booking-dialog'
import { isPublicHoliday, isBookingAvailable } from '@/lib/utils'

interface Equipment {
  id: string
  name: string
  description?: string
  location?: string
}

interface Booking {
  id: string
  startTime: Date
  endTime: Date
  equipment: Equipment
  user?: {
    name?: string
    email: string
  }
  guestName?: string
  purpose: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
}

// 設備顏色映射
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

// 取得設備顏色
function getEquipmentColor(equipmentId: string, isLight: boolean = false) {
  const colors = isLight ? EQUIPMENT_LIGHT_COLORS : EQUIPMENT_COLORS
  return colors[equipmentId as keyof typeof colors] || (isLight ? 'bg-gray-100 text-gray-800 border-gray-200' : 'bg-gray-500')
}

export function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  const [showBookingDialog, setShowBookingDialog] = useState(false)

  useEffect(() => {
    fetchEquipment()
    fetchBookings()
  }, [currentMonth])

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
      const response = await fetch('/api/bookings')
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

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => 
      isSameDay(booking.startTime, date) ||
      (booking.startTime <= date && booking.endTime >= date)
    )
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
  }

  const handleEquipmentSelect = (eq: Equipment) => {
    setSelectedEquipment(eq)
    setShowBookingDialog(true)
  }

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  return (
    <div className="space-y-6">
      {/* 月份導航 */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={previousMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">
          {format(currentMonth, 'yyyy年 MMMM', { locale: zhTW })}
        </h2>
        <Button variant="outline" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* 設備顏色圖例 */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-sm font-medium text-gray-700">設備圖例：</div>
        {equipment.map((eq) => (
          <div key={eq.id} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getEquipmentColor(eq.id)}`}></div>
            <span className="text-sm text-gray-700">{eq.name}</span>
          </div>
        ))}
        <div className="ml-4 flex items-center gap-4 text-xs text-gray-600">
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

      {/* 設備列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {equipment.map((eq) => (
          <Card 
            key={eq.id} 
            className={`cursor-pointer transition-colors hover:bg-gray-50 ${
              selectedEquipment?.id === eq.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => handleEquipmentSelect(eq)}
          >
            <CardContent className="p-4">
              <h3 className="font-medium">{eq.name}</h3>
              {eq.location && (
                <p className="text-sm text-gray-600">{eq.location}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 日曆網格 */}
      <div className="grid grid-cols-7 gap-1">
        {/* 星期標頭 */}
        {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
          <div key={day} className="p-2 text-center font-medium text-gray-500">
            {day}
          </div>
        ))}

        {/* 日期網格 */}
        {daysInMonth.map((date) => {
          const dayBookings = getBookingsForDate(date)
          const isSelected = selectedDate && isSameDay(date, selectedDate)
          const isCurrentMonth = isSameMonth(date, currentMonth)
          const isNotAvailable = !isBookingAvailable(date)

          return (
            <div
              key={date.toString()}
              className={`min-h-[100px] p-2 border cursor-pointer transition-colors ${
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
              <div className="font-medium text-sm">
                {format(date, 'd')}
              </div>
              
              {/* 預約資訊 */}
              <div className="mt-1 space-y-1">
                {dayBookings.slice(0, 3).map((booking) => (
                  <div
                    key={booking.id}
                    className={`text-xs p-1 rounded border ${getEquipmentColor(booking.equipment.id, true)} cursor-pointer hover:opacity-80`}
                    title={`${booking.equipment.name} - ${format(booking.startTime, 'HH:mm')} (${booking.status === 'APPROVED' ? '已核准' : booking.status === 'PENDING' ? '待審核' : '已拒絕'})`}
                  >
                    <div className="flex items-center gap-1 truncate">
                      <div className={`w-2 h-2 rounded-full ${getEquipmentColor(booking.equipment.id)}`}></div>
                      <span className="truncate font-medium">{booking.equipment.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs opacity-75">
                      <Clock className="h-2.5 w-2.5" />
                      {format(booking.startTime, 'HH:mm')}
                      {booking.status === 'PENDING' && <span className="text-orange-600">●</span>}
                      {booking.status === 'APPROVED' && <span className="text-green-600">●</span>}
                      {booking.status === 'REJECTED' && <span className="text-red-600">●</span>}
                    </div>
                  </div>
                ))}
                {dayBookings.length > 3 && (
                  <div className="text-xs text-gray-500 p-1">
                    +{dayBookings.length - 3} 更多預約
                  </div>
                )}
              </div>

              {/* 不可預約日期標示 */}
              {isNotAvailable && (
                <div className="text-xs text-red-500 mt-1">
                  不開放
                </div>
              )}
            </div>
          )
        })}
      </div>

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
    </div>
  )
}
