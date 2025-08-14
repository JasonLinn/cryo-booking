import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('開始建立種子資料...')

  // 建立管理員使用者
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: '系統管理員',
      role: 'ADMIN',
    },
  })

  // 建立測試使用者
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: '測試使用者',
      role: 'USER',
    },
  })

  // 建立設備
  const equipment = [
    {
      id: 'cryo-1',
      name: '低溫儲存設備 1號',
      description: '用於生物樣本低溫保存',
      location: '實驗室 A',
    },
    {
      id: 'cryo-2',
      name: '低溫儲存設備 2號', 
      description: '用於化學試劑低溫保存',
      location: '實驗室 B',
    },
    {
      id: 'cryo-3',
      name: '超低溫冷凍庫',
      description: '用於長期樣本保存',
      location: '實驗室 C',
    },
    {
      id: 'cryo-4',
      name: '液氮儲存槽',
      description: '用於極低溫實驗',
      location: '實驗室 D',
    }
  ]

  for (const eq of equipment) {
    await prisma.equipment.upsert({
      where: { id: eq.id },
      update: eq,
      create: eq,
    })
  }

  // 建立時間段 (9:00-18:00, 每小時一個時段)
  const timeSlots = []
  for (let hour = 9; hour < 18; hour++) {
    timeSlots.push({
      startTime: `${hour.toString().padStart(2, '0')}:00`,
      endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
    })
  }

  for (const slot of timeSlots) {
    await prisma.timeSlot.upsert({
      where: {
        startTime_endTime: {
          startTime: slot.startTime,
          endTime: slot.endTime,
        }
      },
      update: slot,
      create: slot,
    })
  }

  console.log('種子資料建立完成!')
  console.log('管理員:', admin.email)
  console.log('測試使用者:', user.email)
  console.log('設備數量:', equipment.length)
  console.log('時間段數量:', timeSlots.length)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
