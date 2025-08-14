'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Palette, Save } from 'lucide-react'

interface Equipment {
  id: string
  name: string
  description?: string
  location?: string
  color?: string
  isActive: boolean
}

// 預設顏色選項
const COLOR_PRESETS = [
  '#FF6B6B', // 紅色
  '#4ECDC4', // 藍綠色
  '#45B7D1', // 藍色
  '#96CEB4', // 綠色
  '#FECA57', // 黃色
  '#FF9FF3', // 粉色
  '#54A0FF', // 淺藍色
  '#5F27CD', // 紫色
  '#FF6B35', // 橙色
  '#26de81', // 薄荷綠
]

export default function EquipmentColorManager() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    fetchEquipment()
  }, [])

  const fetchEquipment = async () => {
    try {
      const response = await fetch('/api/equipment')
      if (response.ok) {
        const data = await response.json()
        setEquipment(data)
      }
    } catch (error) {
      console.error('取得設備列表失敗:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateEquipmentColor = async (equipmentId: string, color: string) => {
    setSaving(equipmentId)
    try {
      const response = await fetch(`/api/equipment/${equipmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ color }),
      })

      if (response.ok) {
        setEquipment(prev => 
          prev.map(eq => 
            eq.id === equipmentId ? { ...eq, color } : eq
          )
        )
      }
    } catch (error) {
      console.error('更新設備顏色失敗:', error)
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return <div className="p-6">載入中...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Palette className="h-6 w-6" />
        <h1 className="text-2xl font-bold">設備顏色管理</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {equipment.map((eq) => (
          <Card key={eq.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div 
                  className="w-6 h-6 rounded-full border-2"
                  style={{ 
                    backgroundColor: eq.color || '#9CA3AF',
                    borderColor: eq.color ? `${eq.color}80` : '#D1D5DB'
                  }}
                ></div>
                {eq.name}
                <Badge variant={eq.isActive ? 'default' : 'secondary'}>
                  {eq.isActive ? '啟用' : '停用'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {eq.description && (
                <p className="text-sm text-gray-600">{eq.description}</p>
              )}
              {eq.location && (
                <p className="text-sm text-gray-500">📍 {eq.location}</p>
              )}

              <div className="space-y-2">
                <Label>選擇顏色</Label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-transform hover:scale-110 ${
                        eq.color === color ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                      }`}
                      style={{ 
                        backgroundColor: color,
                        borderColor: `${color}80`
                      }}
                      onClick={() => updateEquipmentColor(eq.id, color)}
                      disabled={saving === eq.id}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>自訂顏色</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={eq.color || '#9CA3AF'}
                    onChange={(e) => updateEquipmentColor(eq.id, e.target.value)}
                    className="w-16 h-10 p-1 cursor-pointer"
                    disabled={saving === eq.id}
                  />
                  <Input
                    type="text"
                    value={eq.color || ''}
                    onChange={(e) => updateEquipmentColor(eq.id, e.target.value)}
                    placeholder="#FF6B6B"
                    className="flex-1"
                    disabled={saving === eq.id}
                  />
                </div>
              </div>

              {saving === eq.id && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Save className="h-4 w-4 animate-spin" />
                  儲存中...
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
