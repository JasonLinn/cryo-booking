'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { formatDateTime } from '@/lib/utils'
import { Clock, MapPin, User, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon(booking.status)}
            預約詳情
          </DialogTitle>
          <DialogDescription>
            查看此預約的詳細資訊
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 狀態標籤 */}
          <div className="flex justify-between items-center">
            <h3 className="font-medium">預約狀態</h3>
            <Badge variant={getStatusVariant(booking.status) as any}>
              {getStatusText(booking.status)}
            </Badge>
          </div>

          {/* 設備資訊 */}
          <div className="space-y-2">
            <h3 className="font-medium flex items-center gap-2">
              <span>設備資訊</span>
            </h3>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-medium">{booking.equipment.name}</p>
              {booking.equipment.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {booking.equipment.description}
                </p>
              )}
              {booking.equipment.location && (
                <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {booking.equipment.location}
                </div>
              )}
            </div>
          </div>

          {/* 使用時間 */}
          <div className="space-y-2">
            <h3 className="font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              使用時間
            </h3>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">開始：</span>
                {formatDateTime(booking.startTime)}
              </p>
              <p className="text-sm mt-1">
                <span className="font-medium">結束：</span>
                {formatDateTime(booking.endTime)}
              </p>
            </div>
          </div>

          {/* 預約人員 */}
          <div className="space-y-2">
            <h3 className="font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              預約人員
            </h3>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">姓名：</span>
                {booking.user?.name || booking.guestName || '未提供'}
              </p>
              {booking.user?.email && (
                <p className="text-sm mt-1">
                  <span className="font-medium">信箱：</span>
                  {booking.user.email}
                </p>
              )}
            </div>
          </div>

          {/* 單位/所屬PI */}
          <div className="space-y-2">
            <h3 className="font-medium">單位/所屬PI</h3>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm">{booking.purpose}</p>
            </div>
          </div>

          {/* 拒絕原因 */}
          {booking.status === 'REJECTED' && booking.rejectionReason && (
            <div className="space-y-2">
              <h3 className="font-medium text-red-600">拒絕原因</h3>
              <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                <p className="text-sm text-red-700">{booking.rejectionReason}</p>
              </div>
            </div>
          )}

          {/* 狀態說明 */}
          {booking.status === 'PENDING' && (
            <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              此預約正在等待管理員審核
            </div>
          )}
          
          {booking.status === 'APPROVED' && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle className="h-4 w-4" />
              此預約已核准，請準時使用設備
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
