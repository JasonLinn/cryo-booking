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
import { Label } from '@/components/ui/label'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'

interface Equipment {
  id: string
  name: string
  description?: string
  location?: string
  color?: string
}

interface EquipmentSelectDialogProps {
  equipment: Equipment[]
  selectedDate: Date
  open: boolean
  onOpenChange: (open: boolean) => void
  onEquipmentSelected: (equipment: Equipment) => void
}

// 將 hex 顏色轉為 rgba 格式
function hexToRgba(hex: string, alpha: number = 1): string {
  if (!hex) return 'rgba(156, 163, 175, 1)' // 預設灰色
  
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16) 
  const b = parseInt(hex.slice(5, 7), 16)
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function EquipmentSelectDialog({
  equipment,
  selectedDate,
  open,
  onOpenChange,
  onEquipmentSelected,
}: EquipmentSelectDialogProps) {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)

  const handleSubmit = () => {
    if (selectedEquipment) {
      onEquipmentSelected(selectedEquipment)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>選擇設備</DialogTitle>
          <DialogDescription>
            選擇要預約的設備 - {format(selectedDate, 'yyyy年MM月dd日', { locale: zhTW })}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3">
          <Label>請選擇設備：</Label>
          <div className="grid gap-3">
            {equipment.map((eq) => (
              <div
                key={eq.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50 ${
                  selectedEquipment?.id === eq.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : ''
                }`}
                style={{
                  borderColor: eq.color ? hexToRgba(eq.color, 0.3) : '#D1D5DB'
                }}
                onClick={() => setSelectedEquipment(eq)}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full border-2"
                    style={{ 
                      backgroundColor: eq.color || '#9CA3AF',
                      borderColor: eq.color ? hexToRgba(eq.color, 0.5) : '#D1D5DB'
                    }}
                  ></div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{eq.name}</h3>
                    {eq.description && (
                      <p className="text-sm text-gray-600 mt-1">{eq.description}</p>
                    )}
                    {eq.location && (
                      <p className="text-xs text-gray-500 mt-1">{eq.location}</p>
                    )}
                  </div>
                  <div className="w-5 h-5">
                    {selectedEquipment?.id === eq.id && (
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            取消
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedEquipment}
          >
            確認選擇
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
