import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function showDashboardSummary() {
  try {
    // 統計各種狀態的預約數量
    const totalBookings = await prisma.booking.count()
    const pendingCount = await prisma.booking.count({ where: { status: 'PENDING' } })
    const approvedCount = await prisma.booking.count({ where: { status: 'APPROVED' } })
    const rejectedCount = await prisma.booking.count({ where: { status: 'REJECTED' } })

    console.log('📊 管理員儀表板統計資訊:')
    console.log('=' * 40)
    console.log(`📋 總預約數: ${totalBookings}`)
    console.log(`⏳ 待審核: ${pendingCount}`)
    console.log(`✅ 已核准: ${approvedCount}`)
    console.log(`❌ 已拒絕: ${rejectedCount}`)
    console.log('=' * 40)

    // 顯示最近的已核准預約
    const recentApproved = await prisma.booking.findMany({
      where: { status: 'APPROVED' },
      include: { equipment: true },
      orderBy: { updatedAt: 'desc' },
      take: 3
    })

    console.log('\n✅ 最近核准的預約:')
    recentApproved.forEach((booking, index) => {
      console.log(`${index + 1}. ${booking.guestName} - ${booking.equipment?.name}`)
      console.log(`   核准時間: ${booking.updatedAt.toLocaleString()}`)
    })

    // 顯示最近的已拒絕預約
    const recentRejected = await prisma.booking.findMany({
      where: { status: 'REJECTED' },
      include: { equipment: true },
      orderBy: { updatedAt: 'desc' },
      take: 3
    })

    console.log('\n❌ 最近拒絕的預約:')
    recentRejected.forEach((booking, index) => {
      console.log(`${index + 1}. ${booking.guestName} - ${booking.equipment?.name}`)
      console.log(`   拒絕時間: ${booking.updatedAt.toLocaleString()}`)
      console.log(`   拒絕原因: ${booking.rejectionReason || '無'}`)
    })

    console.log('\n🔗 管理員儀表板 URL: http://localhost:3000/admin/dashboard')
    console.log('👤 管理員帳號: admin@localhost / admin123')

  } catch (error) {
    console.error('獲取統計資訊失敗:', error)
  }
}

showDashboardSummary()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
