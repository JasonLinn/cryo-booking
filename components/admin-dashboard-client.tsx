'use client'

import { useState } from 'react'
import { Booking, User, Equipment } from '@prisma/client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import BookingApprovalList from '@/components/booking-approval-list'

type BookingWithRelations = Booking & {
  user: User | null
  equipment: Equipment | null
}

interface AdminDashboardClientProps {
  pendingBookings: BookingWithRelations[]
  approvedBookings: BookingWithRelations[]
  rejectedBookings: BookingWithRelations[]
  allBookings: BookingWithRelations[]
  pendingCount: number
  approvedCount: number
  rejectedCount: number
  totalBookings: number
}

export function AdminDashboardClient({
  pendingBookings,
  approvedBookings,
  rejectedBookings,
  allBookings,
  pendingCount,
  approvedCount,
  rejectedCount,
  totalBookings
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState("pending")

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="pending" className="relative flex items-center gap-2">
            待審核
            {pendingCount > 0 && (
              <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved" className="relative flex items-center gap-2">
            已核准
            {approvedCount > 0 && (
              <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                {approvedCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rejected" className="relative flex items-center gap-2">
            已拒絕
            {rejectedCount > 0 && (
              <Badge variant="destructive" className="text-xs bg-red-100 text-red-800">
                {rejectedCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="all" className="relative flex items-center gap-2">
            全部預約
            <Badge variant="outline" className="text-xs">
              {totalBookings}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-0">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              待審核預約 ({pendingCount})
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              需要您審核的預約申請，可以核准或拒絕
            </p>
          </div>
          <BookingApprovalList bookings={pendingBookings} showActions={true} />
        </TabsContent>

        <TabsContent value="approved" className="mt-0">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-green-700">
              已核准預約 (最新 10 筆)
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              已經核准的預約申請，按核准時間排序
            </p>
          </div>
          <BookingApprovalList bookings={approvedBookings} showActions={true} />
        </TabsContent>

        <TabsContent value="rejected" className="mt-0">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-red-700">
              已拒絕預約 (最新 10 筆)
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              已經拒絕的預約申請，包含拒絕原因
            </p>
          </div>
          <BookingApprovalList bookings={rejectedBookings} showActions={true} />
        </TabsContent>

        <TabsContent value="all" className="mt-0">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              所有預約 ({totalBookings})
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              系統中的全部預約，按建立時間排序
            </p>
          </div>
          <BookingApprovalList bookings={allBookings} showActions={true} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
