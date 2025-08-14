'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Settings, Palette, Save, Plus, Edit2, Trash2, Power, PowerOff } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

interface Equipment {
  id: string
  name: string
  description?: string
  location?: string
  color?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    bookings: number
  }
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
  '#FF3838', // 鮮紅色
  '#2D3436', // 深灰色
]

interface EditEquipmentDialogProps {
  equipment: Equipment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: () => void
}

function EditEquipmentDialog({ equipment, open, onOpenChange, onSave }: EditEquipmentDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    color: '#FF6B6B',
    isActive: true
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (equipment) {
      setFormData({
        name: equipment.name || '',
        description: equipment.description || '',
        location: equipment.location || '',
        color: equipment.color || '#FF6B6B',
        isActive: equipment.isActive
      })
    } else {
      setFormData({
        name: '',
        description: '',
        location: '',
        color: '#FF6B6B',
        isActive: true
      })
    }
  }, [equipment])

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "錯誤",
        description: "設備名稱為必填欄位",
        variant: "destructive"
      })
      return
    }

    setSaving(true)
    try {
      const url = equipment 
        ? `/api/equipment/${equipment.id}` 
        : '/api/equipment'
      const method = equipment ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "成功",
          description: equipment ? "設備更新成功" : "設備建立成功"
        })
        onSave()
        onOpenChange(false)
      } else {
        throw new Error('操作失敗')
      }
    } catch (error) {
      toast({
        title: "錯誤",
        description: equipment ? "設備更新失敗" : "設備建立失敗",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {equipment ? <Edit2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {equipment ? '編輯設備' : '新增設備'}
          </DialogTitle>
          <DialogDescription>
            {equipment ? '修改設備資訊和設定' : '建立新的設備'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">設備名稱 *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="例如：設備 A"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">描述</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="設備用途說明"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">位置</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="例如：實驗室 A 區"
            />
          </div>

          <div className="space-y-2">
            <Label>設備顏色</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-transform hover:scale-110 ${
                    formData.color === color ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                  }`}
                  style={{ 
                    backgroundColor: color,
                    borderColor: `${color}80`
                  }}
                  onClick={() => setFormData({ ...formData, color })}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-16 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="#FF6B6B"
                className="flex-1"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked: boolean) => setFormData({ ...formData, isActive: checked })}
            />
            <Label htmlFor="isActive">啟用設備</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Save className="h-4 w-4 mr-2 animate-spin" />
                儲存中...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                儲存
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function EquipmentManagement() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

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
      toast({
        title: "錯誤",
        description: "取得設備列表失敗",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (eq: Equipment) => {
    setSelectedEquipment(eq)
    setShowEditDialog(true)
  }

  const handleAdd = () => {
    setSelectedEquipment(null)
    setShowEditDialog(true)
  }

  const handleToggleActive = async (eq: Equipment) => {
    try {
      const response = await fetch(`/api/equipment/${eq.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !eq.isActive }),
      })

      if (response.ok) {
        toast({
          title: "成功",
          description: `設備已${!eq.isActive ? '啟用' : '停用'}`
        })
        fetchEquipment()
      } else {
        throw new Error('操作失敗')
      }
    } catch (error) {
      toast({
        title: "錯誤",
        description: "狀態切換失敗",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (eq: Equipment) => {
    try {
      const response = await fetch(`/api/equipment/${eq.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "成功",
          description: result.message || "設備刪除成功"
        })
        fetchEquipment()
      } else {
        throw new Error('刪除失敗')
      }
    } catch (error) {
      toast({
        title: "錯誤",
        description: "設備刪除失敗",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Settings className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>載入中...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6" />
          <h1 className="text-2xl font-bold">設備管理</h1>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          新增設備
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipment.map((eq) => (
          <Card key={eq.id} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-6 h-6 rounded-full border-2"
                    style={{ 
                      backgroundColor: eq.color || '#9CA3AF',
                      borderColor: eq.color ? `${eq.color}80` : '#D1D5DB'
                    }}
                  ></div>
                  <CardTitle className="text-lg">{eq.name}</CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant={eq.isActive ? 'default' : 'secondary'}>
                    {eq.isActive ? '啟用' : '停用'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {eq.description && (
                <p className="text-sm text-gray-600">{eq.description}</p>
              )}
              {eq.location && (
                <p className="text-sm text-gray-500">📍 {eq.location}</p>
              )}
              
              <div className="text-xs text-gray-400">
                <p>顏色碼: {eq.color || '未設定'}</p>
                {eq._count && (
                  <p>預約數量: {eq._count.bookings}</p>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEdit(eq)}
                >
                  <Edit2 className="h-3 w-3 mr-1" />
                  編輯
                </Button>
                
                <Button
                  variant={eq.isActive ? "destructive" : "default"}
                  size="sm"
                  onClick={() => handleToggleActive(eq)}
                >
                  {eq.isActive ? (
                    <PowerOff className="h-3 w-3" />
                  ) : (
                    <Power className="h-3 w-3" />
                  )}
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>確認刪除</AlertDialogTitle>
                      <AlertDialogDescription>
                        確定要刪除設備「{eq.name}」嗎？
                        {eq._count && eq._count.bookings > 0 && (
                          <span className="text-orange-600">
                            <br />此設備有 {eq._count.bookings} 個相關預約，刪除後設備將被停用而非完全移除。
                          </span>
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(eq)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        確認刪除
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {equipment.length === 0 && (
        <div className="text-center py-12">
          <Settings className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">沒有設備</h3>
          <p className="text-gray-500 mb-4">開始建立您的第一個設備</p>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            新增設備
          </Button>
        </div>
      )}

      <EditEquipmentDialog
        equipment={selectedEquipment}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSave={fetchEquipment}
      />
    </div>
  )
}
