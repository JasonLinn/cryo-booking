import { Suspense } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookingApprovalList } from '@/components/booking-approval-list'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            管理員控制面板
          </h1>
          <p className="text-gray-600 mt-2">
            審核和管理設備預約申請
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 統計卡片 */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">待審核</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>載入中...</div>}>
                  <PendingCount />
                </Suspense>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">今日預約</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>載入中...</div>}>
                  <TodayBookings />
                </Suspense>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">設備狀態</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>可用設備</span>
                    <span className="text-green-600">4</span>
                  </div>
                  <div className="flex justify-between">
                    <span>使用中</span>
                    <span className="text-yellow-600">1</span>
                  </div>
                  <div className="flex justify-between">
                    <span>維護中</span>
                    <span className="text-red-600">0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 審核列表 */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>預約審核</CardTitle>
                <CardDescription>
                  審核使用者的設備預約申請
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>載入中...</div>}>
                  <BookingApprovalList />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

async function PendingCount() {
  // 這裡可以加入待審核數量的查詢
  return (
    <div className="text-2xl font-bold text-orange-600">
      3
    </div>
  )
}

async function TodayBookings() {
  // 這裡可以加入今日預約的查詢
  return (
    <div className="text-2xl font-bold text-blue-600">
      5
    </div>
  )
}
