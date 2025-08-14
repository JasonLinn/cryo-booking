'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { formatDateTime } from '@/lib/utils'
import { Clock, MapPin, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

interface Booking {
  id: string
  startTime: Date
  endTime: Date
  purpose: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  notes?: string
  adminNotes?: string
  createdAt: Date
  equipment: {
    id: string
    name: string
    location?: string
  }
}

export function MyBookingsList() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings')
      if (response.ok) {
        const data = await response.json()
        const processedBookings = data.map((booking: any) => ({
          ...booking,
          startTime: new Date(booking.startTime),
          endTime: new Date(booking.endTime),
          createdAt: new Date(booking.createdAt),
        }))
        setBookings(processedBookings)
      }
    } catch (error) {
      console.error('取得預約列表失敗:', error)
      toast({
        title: '載入失敗',
        description: '無法載入預約列表',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'REJECTED':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'PENDING':
      default:
        return <AlertCircle className="h-5 w-5 text-orange-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return '已核准'
      case 'REJECTED':
        return '已拒絕'
      case 'PENDING':
      default:
        return '待審核'
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'default'
      case 'REJECTED':
        return 'destructive'
      case 'PENDING':
      default:
        return 'secondary'
    }
  }

  if (loading) {
    return <div className="text-center py-8">載入中...</div>
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>您還沒有任何預約記錄</p>
        <p className="text-sm mt-2">點擊首頁日曆建立您的第一個預約</p>
      </div>
    )
  }

  // 按狀態分組並排序
  const sortedBookings = bookings.sort((a, b) => {
    // 先按狀態排序：PENDING > APPROVED > REJECTED
    const statusOrder = { PENDING: 0, APPROVED: 1, REJECTED: 2 }
    const statusDiff = statusOrder[a.status] - statusOrder[b.status]
    if (statusDiff !== 0) return statusDiff
    
    // 再按建立時間排序（新的在前）
    return b.createdAt.getTime() - a.createdAt.getTime()
  })

  return (
    <div className="space-y-4">
      {sortedBookings.map((booking) => (
        <Card key={booking.id} className={`
          border-l-4 
          ${booking.status === 'APPROVED' ? 'border-l-green-400' : 
            booking.status === 'REJECTED' ? 'border-l-red-400' : 
            'border-l-orange-400'}
        `}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {getStatusIcon(booking.status)}
                  {booking.equipment.name}
                </CardTitle>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  {booking.equipment.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {booking.equipment.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    申請時間：{formatDateTime(booking.createdAt)}
                  </div>
                </div>
              </div>
              <Badge variant={getStatusVariant(booking.status) as any}>
                {getStatusText(booking.status)}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* 預約時間 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">使用時間</h4>
              <p className="text-sm text-gray-600">
                {formatDateTime(booking.startTime)} - {formatDateTime(booking.endTime)}
              </p>
            </div>

            {/* 使用目的 */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">使用目的</h4>
              <p className="text-sm text-gray-600">
                {booking.purpose}
              </p>
            </div>

            {/* 管理員備註 */}
            {booking.adminNotes && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  管理員備註
                </h4>
                <div className={`p-3 rounded-lg text-sm ${
                  booking.status === 'REJECTED' 
                    ? 'bg-red-50 text-red-700' 
                    : 'bg-blue-50 text-blue-700'
                }`}>
                  {booking.adminNotes}
                </div>
              </div>
            )}

            {/* 狀態說明 */}
            {booking.status === 'PENDING' && (
              <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                您的預約正在等待管理員審核，審核結果將透過郵件通知您
              </div>
            )}
            
            {booking.status === 'APPROVED' && (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                <CheckCircle className="h-4 w-4" />
                您的預約已核准，請準時使用設備
              </div>
            )}
            
            {booking.status === 'REJECTED' && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                <XCircle className="h-4 w-4" />
                您的預約已被拒絕，如有疑問請聯繫管理員
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
