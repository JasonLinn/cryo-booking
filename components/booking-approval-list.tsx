'use client'

import { useState } from 'react'
import { Booking, User, Equipment } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'

type BookingWithRelations = Booking & {
  user: User | null
  equipment: Equipment | null
}

interface BookingApprovalListProps {
  bookings: BookingWithRelations[]
  showActions?: boolean
}

export default function BookingApprovalList({ 
  bookings: initialBookings, 
  showActions = true 
}: BookingApprovalListProps) {
  const [bookings, setBookings] = useState<BookingWithRelations[]>(initialBookings)
  const [loading, setLoading] = useState<string | null>(null)
  const { toast } = useToast()

  const handleApproval = async (bookingId: string, action: 'approve' | 'reject') => {
    setLoading(bookingId)
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: action === 'approve' ? 'APPROVED' : 'REJECTED' 
        }),
      })

      if (response.ok) {
        const updatedBooking = await response.json()
        
        // 更新本地狀態，移除已處理的預約
        setBookings(prevBookings => 
          prevBookings.filter(booking => booking.id !== bookingId)
        )
        
        toast({
          title: "成功",
          description: `預約已${action === 'approve' ? '核准' : '拒絕'}`,
        })
      } else {
        throw new Error('操作失敗')
      }
    } catch (error) {
      toast({
        title: "錯誤",
        description: "操作失敗，請重試",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary">待審核</Badge>
      case 'APPROVED':
        return <Badge variant="default">已核准</Badge>
      case 'REJECTED':
        return <Badge variant="destructive">已拒絕</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        目前沒有待審核的預約
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const userName = booking.user?.name || booking.user?.email || booking.guestName || '未知使用者'
        const equipmentName = booking.equipment?.name || '未知設備'
        
        return (
          <Card key={booking.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">
                  設備預約申請
                </CardTitle>
                {getStatusBadge(booking.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">申請人</p>
                  <p className="font-medium">
                    {userName}
                    {booking.guestName && ' (訪客)'}
                  </p>
                  {booking.guestEmail && (
                    <p className="text-sm text-gray-500">{booking.guestEmail}</p>
                  )}
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">設備</p>
                  <p className="font-medium">{equipmentName}</p>
                  {booking.equipment?.location && (
                    <p className="text-sm text-gray-500">{booking.equipment.location}</p>
                  )}
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">使用時間</p>
                  <p className="font-medium">
                    {formatDateTime(booking.startTime)} - {formatDateTime(booking.endTime)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">申請時間</p>
                  <p className="font-medium">{formatDateTime(booking.createdAt)}</p>
                </div>
                
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">使用目的</p>
                  <p className="font-medium">{booking.purpose}</p>
                </div>
                
                {/* 顯示審核資訊 */}
                {(booking.status === 'APPROVED' || booking.status === 'REJECTED') && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">
                      {booking.status === 'APPROVED' ? '核准時間' : '拒絕時間'}
                    </p>
                    <p className="font-medium">{formatDateTime(booking.updatedAt)}</p>
                    {booking.status === 'REJECTED' && booking.rejectionReason && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">拒絕原因</p>
                        <p className="text-sm text-red-600">{booking.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {showActions && booking.status === 'PENDING' && (
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="default"
                    onClick={() => handleApproval(booking.id, 'approve')}
                    disabled={loading === booking.id}
                  >
                    {loading === booking.id ? '處理中...' : '核准'}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleApproval(booking.id, 'reject')}
                    disabled={loading === booking.id}
                  >
                    {loading === booking.id ? '處理中...' : '拒絕'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
