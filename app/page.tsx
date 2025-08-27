import { Suspense } from 'react'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/lib/auth'
import { Calendar } from '@/components/calendar'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PrismaClient } from '@prisma/client'
import { getEquipmentStatusConfig } from '@/lib/equipment-status'

const prisma = new PrismaClient()

export default async function HomePage() {
  // const session = await getServerSession(authOptions)
  const session = null // 暫時關閉認證

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            TissueCryoEM core預約系統
          </h1>
          <p className="text-gray-600 mt-2">
            {session 
              ? `歡迎！請選擇日期和設備進行預約。`
              : '請選擇日期和設備進行預約。'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* 日曆區域 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-4 lg:pb-6">
                <CardTitle className="text-lg lg:text-xl">預約日曆</CardTitle>
                <CardDescription className="text-sm lg:text-base">
                  點擊日期選擇設備進行預約
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 lg:p-6">
                <Suspense fallback={<div className="text-center py-8 lg:py-12">載入中...</div>}>
                  <Calendar />
                </Suspense>
              </CardContent>
            </Card>
          </div>

          {/* 側邊欄 */}
          <div className="space-y-4 lg:space-y-6">
            <Card>
              <CardHeader className="pb-4 lg:pb-6">
                <CardTitle className="text-lg lg:text-xl">快速資訊</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 lg:space-y-4 p-4 lg:p-6">
                <div>
                  <h4 className="font-medium text-gray-900 text-sm lg:text-base">開放時間</h4>
                  <p className="text-sm text-gray-600">
                    週一至週五 09:00-18:00
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    週末（六、日）不開放預約
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 text-sm lg:text-base">預約規則</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 需要管理員審核</li>
                    <li>• 最多提前 30 天預約</li>
                    <li>• 週末（六、日）不開放預約</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4 lg:pb-6">
                <CardTitle className="text-lg lg:text-xl">設備狀態</CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6">
                <Suspense fallback={<div className="text-center py-4">載入中...</div>}>
                  <EquipmentStatus />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

async function EquipmentStatus() {
  try {
    // 從資料庫獲取所有設備
    const equipment = await prisma.equipment.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        color: true,
        _count: {
          select: {
            bookings: {
              where: {
                status: 'APPROVED',
                startTime: { lte: new Date() },
                endTime: { gte: new Date() }
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    return (
      <div className="space-y-2 lg:space-y-3">
        {equipment.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-sm">
            目前沒有設備資料
          </div>
        ) : (
          equipment.map((eq) => {
            const statusConfig = getEquipmentStatusConfig(eq.status)
            const isInUse = eq._count.bookings > 0
            
            // 如果設備目前有進行中的預約，顯示為使用中
            const displayStatus = isInUse ? {
              label: '使用中',
              color: 'bg-yellow-100 text-yellow-800'
            } : statusConfig

            return (
              <div key={eq.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: eq.color || '#9CA3AF' }}
                  ></div>
                  <span className="text-xs lg:text-sm">{eq.name}</span>
                </div>
                <Badge 
                  variant="outline"
                  className={`text-xs px-2 py-1 ${displayStatus.color}`}
                >
                  {displayStatus.label}
                </Badge>
              </div>
            )
          })
        )}
      </div>
    )
  } catch (error) {
    console.error('獲取設備狀態失敗:', error)
    return (
      <div className="text-center py-4 text-red-500 text-sm">
        載入設備狀態失敗
      </div>
    )
  }
}
