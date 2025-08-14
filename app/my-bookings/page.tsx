import { Suspense } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MyBookingsList } from '@/components/my-bookings-list'

export default async function MyBookingsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            我的預約
          </h1>
          <p className="text-gray-600 mt-2">
            檢視和管理您的設備預約記錄
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>預約記錄</CardTitle>
            <CardDescription>
              這裡顯示您所有的預約申請和狀態
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>載入中...</div>}>
              <MyBookingsList />
            </Suspense>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
