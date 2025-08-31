'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface RejectBookingDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  isLoading: boolean
  bookingInfo?: {
    userName: string
    equipmentName: string
    startTime: Date
    endTime: Date
  }
}

export default function RejectBookingDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  bookingInfo
}: RejectBookingDialogProps) {
  const [reason, setReason] = useState('')

  const handleSubmit = () => {
    onConfirm(reason)
    setReason('') // 清空輸入
  }

  const handleCancel = () => {
    setReason('') // 清空輸入
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>拒絕預約申請</DialogTitle>
          <DialogDescription>
            請輸入拒絕此預約申請的原因，這將會發送給申請人。
          </DialogDescription>
        </DialogHeader>
        
        {bookingInfo && (
          <div className="py-4 border-t border-b bg-gray-50 rounded">
            <div className="text-sm space-y-1">
              <p><strong>申請人：</strong>{bookingInfo.userName}</p>
              <p><strong>設備：</strong>{bookingInfo.equipmentName}</p>
              <p>
                <strong>時間：</strong>
                {bookingInfo.startTime.toLocaleString('zh-TW')} - {bookingInfo.endTime.toLocaleString('zh-TW')}
              </p>
            </div>
          </div>
        )}
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reason">拒絕原因</Label>
            <Textarea
              id="reason"
              placeholder="請輸入拒絕原因..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              disabled={isLoading}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isLoading}
          >
            取消
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleSubmit}
            disabled={isLoading || !reason.trim()}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                拒絕中...
              </div>
            ) : (
              '確認拒絕'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
