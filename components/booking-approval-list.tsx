'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { formatDateTime } from '@/lib/utils'
import { Check, X, Clock, User, MapPin } from 'lucide-react'

interface Booking {
  id: string
  startTime: Date
  endTime: Date
  purpose: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  notes?: string
  adminNotes?: string
  createdAt: Date
  user: {
    id: string
    name: string
    email: string
    department?: string
  }
  equipment: {
    id: string
    name: string
    location?: string
  }
}

export function BookingApprovalList() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({})
  const { toast } = useToast()

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings?status=PENDING')
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

  const handleApproval = async (bookingId: string, status: 'APPROVED' | 'REJECTED') => {
    setProcessingId(bookingId)
    
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          adminNotes: adminNotes[bookingId] || '',
        }),
      })

      if (response.ok) {
        toast({
          title: `預約已${status === 'APPROVED' ? '核准' : '拒絕'}`,
          description: '使用者將收到郵件通知',
        })
        
        // 從列表中移除已處理的預約
        setBookings(prev => prev.filter(b => b.id !== bookingId))
        
        // 清除備註
        setAdminNotes(prev => {
          const newNotes = { ...prev }
          delete newNotes[bookingId]
          return newNotes
        })
      } else {
        const error = await response.json()
        throw new Error(error.error)
      }
    } catch (error) {
      console.error('處理預約失敗:', error)
      toast({
        title: '處理失敗',
        description: error instanceof Error ? error.message : '發生未知錯誤',
        variant: 'destructive',
      })
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return <div className="text-center py-8">載入中...</div>
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        目前沒有待審核的預約申請
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card key={booking.id} className="border-l-4 border-l-orange-400">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {booking.equipment.name}
                </CardTitle>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {booking.user.name || booking.user.email}
                  </div>
                  {booking.equipment.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {booking.equipment.location}
                    </div>
                  )}
                </div>
              </div>
              <Badge variant="secondary">
                {formatDateTime(booking.createdAt)}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* 預約資訊 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900">使用時間</h4>
                  <p className="text-sm text-gray-600">
                    {formatDateTime(booking.startTime)} - {formatDateTime(booking.endTime)}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">申請人資訊</h4>
                  <p className="text-sm text-gray-600">
                    {booking.user.email}
                    {booking.user.department && ` (${booking.user.department})`}
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium text-gray-900">使用目的</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {booking.purpose}
                </p>
              </div>
            </div>

            {/* 管理員備註 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                管理員備註 (選填)
              </label>
              <Textarea
                placeholder="請輸入審核備註..."
                value={adminNotes[booking.id] || ''}
                onChange={(e) => setAdminNotes(prev => ({
                  ...prev,
                  [booking.id]: e.target.value
                }))}
                rows={2}
              />
            </div>

            {/* 操作按鈕 */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => handleApproval(booking.id, 'APPROVED')}
                disabled={processingId === booking.id}
                className="flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                核准
              </Button>
              
              <Button
                variant="destructive"
                onClick={() => handleApproval(booking.id, 'REJECTED')}
                disabled={processingId === booking.id}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                拒絕
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
