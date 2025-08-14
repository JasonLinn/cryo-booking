'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'

interface Equipment {
  id: string
  name: string
  description?: string
  location?: string
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

interface BookingDetailsDialogProps {
  booking: Booking | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BookingDetailsDialog({
  booking,
  open,
  onOpenChange,
}: BookingDetailsDialogProps) {
  if (!booking) return null

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '待審核'
      case 'APPROVED':
        return '已核准'
      case 'REJECTED':
        return '已拒絕'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-orange-100 text-orange-800'
      case 'APPROVED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>預約詳情</DialogTitle>
          <DialogDescription>
            查看預約的詳細資訊
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">狀態</span>
            <Badge className={getStatusColor(booking.status)}>
              {getStatusText(booking.status)}
            </Badge>
          </div>
          
          <div>
            <span className="font-medium">設備</span>
            <p className="text-gray-600">{booking.equipment.name}</p>
          </div>
          
          <div>
            <span className="font-medium">使用者</span>
            <p className="text-gray-600">
              {booking.user ? booking.user.name || booking.user.email : booking.guestName}
            </p>
          </div>
          
          <div>
            <span className="font-medium">日期時間</span>
            <p className="text-gray-600">
              {format(booking.startTime, 'yyyy年MM月dd日 HH:mm', { locale: zhTW })} - {format(booking.endTime, 'HH:mm', { locale: zhTW })}
            </p>
          </div>
          
          <div>
            <span className="font-medium">使用目的</span>
            <p className="text-gray-600 whitespace-pre-wrap">{booking.purpose}</p>
          </div>
          
          {booking.rejectionReason && (
            <div>
              <span className="font-medium text-red-600">拒絕原因</span>
              <p className="text-red-600 whitespace-pre-wrap">{booking.rejectionReason}</p>
            </div>
          )}
          
          {booking.createdAt && (
            <div>
              <span className="font-medium">建立時間</span>
              <p className="text-gray-600">
                {format(booking.createdAt, 'yyyy年MM月dd日 HH:mm', { locale: zhTW })}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            關閉
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
