import { Suspense } from 'react'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/lib/auth'
import { Calendar } from '@/components/calendar'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function HomePage() {
  // const session = await getServerSession(authOptions)
  const session = null // 暫時關閉認證

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            低溫設備預約系統
          </h1>
          <p className="text-gray-600 mt-2">
            {session 
              ? `歡迎！請選擇日期和設備進行預約。`
              : '請選擇日期和設備進行預約。'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 日曆區域 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>預約日曆</CardTitle>
                <CardDescription>
                  點擊日期選擇設備進行預約
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>載入中...</div>}>
                  <Calendar />
                </Suspense>
              </CardContent>
            </Card>
          </div>

          {/* 側邊欄 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>快速資訊</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">開放時間</h4>
                  <p className="text-sm text-gray-600">
                    週一至週五 09:00-18:00
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    週末（六、日）不開放預約
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">預約規則</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 需要管理員審核</li>
                    <li>• 最多提前 30 天預約</li>
                    <li>• 週末（六、日）不開放預約</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>設備狀態</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>載入中...</div>}>
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
  // 這裡可以加入設備狀態的資料
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm">低溫恆溫器 A</span>
        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
          可用
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">低溫恆溫器 B</span>
        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
          可用
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">稀釋致冷機</span>
        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
          使用中
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">氦氣回收系統</span>
        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
          可用
        </span>
      </div>
    </div>
  )
}
