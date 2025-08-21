import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 檢查是否已存在設備
  let equipment1 = await prisma.equipment.findFirst({
    where: { name: '測試設備 1' }
  })

  if (!equipment1) {
    equipment1 = await prisma.equipment.create({
      data: {
        name: '測試設備 1',
        description: '這是一個測試設備',
        location: '實驗室 A',
        color: '#3B82F6',
        status: 'AVAILABLE'
      }
    })
  }

  let equipment2 = await prisma.equipment.findFirst({
    where: { name: '測試設備 2' }
  })

  if (!equipment2) {
    equipment2 = await prisma.equipment.create({
      data: {
        name: '測試設備 2',
        description: '這是另一個測試設備',
        location: '實驗室 B',
        color: '#10B981',
        status: 'AVAILABLE'
      }
    })
  }

  // 建立測試預約 (訪客預約)
  await prisma.booking.create({
    data: {
      equipmentId: equipment1.id,
      guestName: '測試訪客',
      guestEmail: 'guest@example.com',
      startTime: new Date('2025-08-22T10:00:00'),
      endTime: new Date('2025-08-22T12:00:00'),
      purpose: '測試實驗',
      status: 'PENDING'
    }
  })

  // 建立另一個測試預約
  await prisma.booking.create({
    data: {
      equipmentId: equipment2.id,
      guestName: '另一個訪客',
      guestEmail: 'guest2@example.com',
      startTime: new Date('2025-08-23T14:00:00'),
      endTime: new Date('2025-08-23T16:00:00'),
      purpose: '產品測試',
      status: 'PENDING'
    }
  })

  console.log('測試資料建立完成')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
