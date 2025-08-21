import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import BookingApprovalList from "@/components/booking-approval-list"
import { Navbar } from "@/components/navbar"
import { AdminDashboardClient } from "@/components/admin-dashboard-client"

const prisma = new PrismaClient()

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  // 獲取各種狀態的預約
  const pendingBookings = await prisma.booking.findMany({
    where: { status: 'PENDING' },
    include: {
      user: true,
      equipment: true,
    },
    orderBy: { createdAt: 'desc' }
  })

  const approvedBookings = await prisma.booking.findMany({
    where: { status: 'APPROVED' },
    include: {
      user: true,
      equipment: true,
    },
    orderBy: { updatedAt: 'desc' },
    take: 10 // 只顯示最近 10 個
  })

  const rejectedBookings = await prisma.booking.findMany({
    where: { status: 'REJECTED' },
    include: {
      user: true,
      equipment: true,
    },
    orderBy: { updatedAt: 'desc' },
    take: 10 // 只顯示最近 10 個
  })

  // 計算統計資訊
  const totalBookings = await prisma.booking.count()
  const pendingCount = pendingBookings.length
  const approvedCount = await prisma.booking.count({ where: { status: 'APPROVED' } })
  const rejectedCount = await prisma.booking.count({ where: { status: 'REJECTED' } })

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">管理員儀表板</h1>
        
        {/* 統計卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">總預約數</h3>
            <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">待審核</h3>
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">已核准</h3>
            <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">已拒絕</h3>
            <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <AdminDashboardClient
            pendingBookings={pendingBookings}
            approvedBookings={approvedBookings}
            rejectedBookings={rejectedBookings}
            pendingCount={pendingCount}
            approvedCount={approvedCount}
            rejectedCount={rejectedCount}
          />
        </div>
      </div>
    </>
  )
}
