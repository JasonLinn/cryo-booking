import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testApproval() {
  // 查詢所有待審核的預約
  const pendingBookings = await prisma.booking.findMany({
    where: { status: 'PENDING' },
    include: {
      equipment: true
    },
    orderBy: { createdAt: 'desc' }
  })

  console.log(`找到 ${pendingBookings.length} 個待審核預約:`)
  
  pendingBookings.forEach((booking, index) => {
    console.log(`${index + 1}. 預約 ID: ${booking.id}`)
    console.log(`   申請人: ${booking.guestName}`)
    console.log(`   設備: ${booking.equipment?.name}`)
    console.log(`   時間: ${booking.startTime.toLocaleString()} - ${booking.endTime.toLocaleString()}`)
    console.log(`   狀態: ${booking.status}`)
    console.log('')
  })

  if (pendingBookings.length > 0) {
    console.log('您可以在管理員儀表板測試核准功能')
    console.log('URL: http://localhost:3000/admin/dashboard')
    console.log('管理員帳號: admin@localhost / admin123')
  }
}

testApproval()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
