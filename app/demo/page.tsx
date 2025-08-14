'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Palette, Calendar, User } from 'lucide-react'
import Link from 'next/link'

export default function EquipmentDemo() {
  const [selectedEquipment, setSelectedEquipment] = useState('A')

  const equipments = [
    { id: 'A', name: '設備 A', color: '#FF6B6B', description: '冷凍乾燥設備 A', location: '實驗室 A 區' },
    { id: 'B', name: '設備 B', color: '#4ECDC4', description: '冷凍乾燥設備 B', location: '實驗室 B 區' },
    { id: 'C', name: '設備 C', color: '#45B7D1', description: '冷凍乾燥設備 C', location: '實驗室 C 區' },
    { id: 'D', name: '設備 D', color: '#96CEB4', description: '冷凍乾燥設備 D', location: '實驗室 D 區' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 頁首 */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎨 設備顏色展示
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            設備 A、B、C、D 已成功建立並設定顏色！
          </p>
        </div>

        {/* 設備顏色圖例 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-6 w-6" />
              設備顏色圖例
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {equipments.map((eq) => (
                <div 
                  key={eq.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                    selectedEquipment === eq.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  style={{ 
                    backgroundColor: `${eq.color}15`,
                    borderColor: `${eq.color}50`
                  }}
                  onClick={() => setSelectedEquipment(eq.id)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-6 h-6 rounded-full border-2"
                      style={{ 
                        backgroundColor: eq.color,
                        borderColor: `${eq.color}80`
                      }}
                    ></div>
                    <h3 className="font-bold text-lg">{eq.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{eq.description}</p>
                  <p className="text-xs text-gray-500">📍 {eq.location}</p>
                  <div className="mt-2 text-xs font-mono text-gray-700">
                    {eq.color}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 選中設備詳情 */}
        {selectedEquipment && (
          <Card>
            <CardHeader>
              <CardTitle>
                {equipments.find(e => e.id === selectedEquipment)?.name} 詳細資訊
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const eq = equipments.find(e => e.id === selectedEquipment)!
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">設備顏色</h4>
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-16 h-16 rounded-lg border-4"
                            style={{ 
                              backgroundColor: eq.color,
                              borderColor: `${eq.color}50`
                            }}
                          ></div>
                          <div>
                            <p className="font-mono text-lg">{eq.color}</p>
                            <p className="text-sm text-gray-600">Hex 顏色碼</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">設備資訊</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">名稱：</span>{eq.name}</p>
                          <p><span className="font-medium">描述：</span>{eq.description}</p>
                          <p><span className="font-medium">位置：</span>{eq.location}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-700 mb-2">預約時段</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>📅 週一至週五</p>
                        <p>🕘 09:00 - 17:00</p>
                        <p>❌ 週末及假日不開放</p>
                      </div>
                      
                      <div className="mt-4">
                        <Button className="w-full" asChild>
                          <Link href="/">
                            <Calendar className="w-4 h-4 mr-2" />
                            前往日曆預約
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        )}

        {/* 管理員功能 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6" />
              管理員功能
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                使用管理員帳戶登入後，可以進行進階設定：
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">🎨 顏色管理</h4>
                  <p className="text-sm text-blue-700">自訂設備顏色，支援色彩選擇器</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">⚙️ 設備管理</h4>
                  <p className="text-sm text-green-700">新增、編輯、停用設備</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">📋 預約審核</h4>
                  <p className="text-sm text-purple-700">審核、核准、拒絕預約申請</p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">👥 使用者管理</h4>
                  <p className="text-sm text-orange-700">管理使用者帳戶和權限</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">📧 管理員登入資訊</h4>
                <div className="space-y-1 text-sm font-mono">
                  <p>Email: admin@localhost</p>
                  <p>密碼: admin123</p>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  ⚠️ 請在正式環境中更改預設密碼
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 快速連結 */}
        <div className="text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link href="/">
                <Calendar className="w-4 h-4 mr-2" />
                查看日曆
              </Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link href="/auth/signin">
                <User className="w-4 h-4 mr-2" />
                管理員登入
              </Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link href="/admin/equipment-colors">
                <Palette className="w-4 h-4 mr-2" />
                顏色管理
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
