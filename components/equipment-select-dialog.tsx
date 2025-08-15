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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto mx-4 sm:mx-0">
        <DialogHeader>
          <DialogTitle className="text-lg lg:text-xl">選擇設備</DialogTitle>
          <DialogDescription className="text-sm lg:text-base">
            選擇要預約的設備 - {format(selectedDate, 'yyyy年MM月dd日', { locale: zhTW })}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 lg:space-y-4">
          <Label className="text-sm lg:text-base">請選擇設備：</Label>
          <div className="grid gap-2 lg:gap-3 max-h-[60vh] overflow-y-auto">
            {equipment.map((eq) => (
              <div
                key={eq.id}
                className={`p-3 lg:p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50 ${
                  selectedEquipment?.id === eq.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : ''
                }`}
                style={{
                  borderColor: eq.color ? hexToRgba(eq.color, 0.3) : '#D1D5DB'
                }}
                onClick={() => setSelectedEquipment(eq)}
              >
                <div className="flex items-center gap-2 lg:gap-3">
                  <div 
                    className="w-3 h-3 lg:w-4 lg:h-4 rounded-full border-2 flex-shrink-0"
                    style={{ 
                      backgroundColor: eq.color || '#9CA3AF',
                      borderColor: eq.color ? hexToRgba(eq.color, 0.5) : '#D1D5DB'
                    }}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm lg:text-base truncate">{eq.name}</h3>
                    {eq.description && (
                      <p className="text-xs lg:text-sm text-gray-600 mt-1 line-clamp-2">{eq.description}</p>
                    )}
                    {eq.location && (
                      <p className="text-xs text-gray-500 mt-1 truncate">{eq.location}</p>
                    )}
                  </div>
                  <div className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0">
                    {selectedEquipment?.id === eq.id && (
                      <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-white"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 sm:flex-initial"
          >
            取消
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedEquipment}
            className="flex-1 sm:flex-initial"
          >
            確認選擇
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
