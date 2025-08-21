import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 獲取現有設備
  const equipment = await prisma.equipment.findMany()
  
  if (equipment.length === 0) {
    console.log('沒有找到設備，請先運行基本測試資料腳本')
    return
  }

  // 建立新的測試預約
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const dayAfterTomorrow = new Date(now)
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)

  // 預約 1
  await prisma.booking.create({
    data: {
      equipmentId: equipment[0].id,
      guestName: '新測試訪客 1',
      guestEmail: 'newguest1@example.com',
      startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 9, 0),
      endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 11, 0),
      purpose: '新實驗測試 - 需要審核',
      status: 'PENDING'
    }
  })

  // 預約 2
  await prisma.booking.create({
    data: {
      equipmentId: equipment[1] ? equipment[1].id : equipment[0].id,
      guestName: '新測試訪客 2',
      guestEmail: 'newguest2@example.com',
      startTime: new Date(dayAfterTomorrow.getFullYear(), dayAfterTomorrow.getMonth(), dayAfterTomorrow.getDate(), 14, 0),
      endTime: new Date(dayAfterTomorrow.getFullYear(), dayAfterTomorrow.getMonth(), dayAfterTomorrow.getDate(), 16, 0),
      purpose: '品質控制測試 - 等待核准',
      status: 'PENDING'
    }
  })

  // 預約 3
  await prisma.booking.create({
    data: {
      equipmentId: equipment[0].id,
      guestName: '新測試訪客 3',
      guestEmail: 'newguest3@example.com',
      startTime: new Date(dayAfterTomorrow.getFullYear(), dayAfterTomorrow.getMonth(), dayAfterTomorrow.getDate(), 10, 0),
      endTime: new Date(dayAfterTomorrow.getFullYear(), dayAfterTomorrow.getMonth(), dayAfterTomorrow.getDate(), 12, 0),
      purpose: '研究項目測試 - 待審核',
      status: 'PENDING'
    }
  })

  console.log('新的測試預約建立完成，共建立 3 個待審核預約')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
