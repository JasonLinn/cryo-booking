'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'

interface Equipment {
  id: string
  name: string
  description?: string
  location?: string
}

interface BookingDialogProps {
  equipment: Equipment
  selectedDate: Date
  open: boolean
  onOpenChange: (open: boolean) => void
  onBookingCreated: () => void
}

export function BookingDialog({
  equipment,
  selectedDate,
  open,
  onOpenChange,
  onBookingCreated,
}: BookingDialogProps) {
  const { data: session } = useSession()
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [purpose, setPurpose] = useState('')
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const startDateTime = new Date(selectedDate)
      const endDateTime = new Date(selectedDate)
      const [startHour, startMinute] = startTime.split(':').map(Number)
      const [endHour, endMinute] = endTime.split(':').map(Number)

      startDateTime.setHours(startHour, startMinute, 0, 0)
      endDateTime.setHours(endHour, endMinute, 0, 0)

      if (startDateTime >= endDateTime) {
        toast({
          title: '時間錯誤',
          description: '結束時間必須晚於開始時間',
          variant: 'destructive',
        })
        return
      }

      // 檢查非登入使用者的必要資訊
      if (!session && (!guestName || !guestEmail)) {
        toast({
          title: '資訊不完整',
          description: '請填寫您的姓名和聯絡信箱',
          variant: 'destructive',
        })
        return
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          equipmentId: equipment.id,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          purpose,
          guestName: !session ? guestName : undefined,
          guestEmail: !session ? guestEmail : undefined,
        }),
      })

      if (response.ok) {
        toast({
          title: '預約成功',
          description: '您的預約申請已提交，等待管理員審核',
        })
        onBookingCreated()
      } else {
        const error = await response.json()
        toast({
          title: '預約失敗',
          description: error.error || '發生未知錯誤',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('預約失敗:', error)
      toast({
        title: '預約失敗',
        description: '發生網路錯誤，請重試',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>預約設備</DialogTitle>
          <DialogDescription>
            預約 {equipment.name} - {format(selectedDate, 'yyyy年MM月dd日', { locale: zhTW })}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">開始時間</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                min="09:00"
                max="18:00"
                required
              />
            </div>
            <div>
              <Label htmlFor="endTime">結束時間</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                min="09:00"
                max="18:00"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="purpose">單位/所屬PI</Label>
            <Textarea
              id="purpose"
              placeholder=""
              value={purpose}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPurpose(e.target.value)}
              required
              rows={3}
            />
          </div>
          {/* 非登入使用者的基本資訊表單 */}
          {!session && (
            <>
              <div>
                <Label htmlFor="guestName">姓名</Label>
                <Input
                  id="guestName"
                  type="text"
                  placeholder="請輸入您的姓名"
                  value={guestName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGuestName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="guestEmail">聯絡信箱</Label>
                <Input
                  id="guestEmail"
                  type="email"
                  placeholder="請輸入您的聯絡信箱"
                  value={guestEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGuestEmail(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '提交中...' : '提交預約'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
