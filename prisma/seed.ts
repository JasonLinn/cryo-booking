import { PrismaClient, UserRole } from '@prisma/client'

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
      role: UserRole.ADMIN,
      department: '資訊中心',
    },
  })

  // 建立測試使用者
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: '測試使用者',
      role: UserRole.USER,
      department: '研究所',
    },
  })

  // 建立儀器設備
  const equipment1 = await prisma.equipment.upsert({
    where: { id: 'cryostat-1' },
    update: {},
    create: {
      id: 'cryostat-1',
      name: '低溫恆溫器 A',
      description: '溫度範圍: -196°C to 25°C，適用於材料性質測量',
      location: '實驗室 101',
    },
  })

  const equipment2 = await prisma.equipment.upsert({
    where: { id: 'cryostat-2' },
    update: {},
    create: {
      id: 'cryostat-2',
      name: '低溫恆溫器 B',
      description: '溫度範圍: -269°C to 25°C，適用於超導材料研究',
      location: '實驗室 102',
    },
  })

  const equipment3 = await prisma.equipment.upsert({
    where: { id: 'dilution-fridge' },
    update: {},
    create: {
      id: 'dilution-fridge',
      name: '稀釋致冷機',
      description: '溫度範圍: 5mK to 4K，適用於量子物理實驗',
      location: '實驗室 103',
    },
  })

  const equipment4 = await prisma.equipment.upsert({
    where: { id: 'helium-recovery' },
    update: {},
    create: {
      id: 'helium-recovery',
      name: '氦氣回收系統',
      description: '氦氣回收與純化系統',
      location: '實驗室 104',
    },
  })

  // 建立時段設定 (平日 9:00-18:00)
  const timeSlots = []
  for (let day = 1; day <= 5; day++) { // Monday to Friday
    for (const equipmentId of [equipment1.id, equipment2.id, equipment3.id, equipment4.id]) {
      await prisma.timeSlot.upsert({
        where: { 
          id: `${equipmentId}-day${day}-9-18`
        },
        update: {},
        create: {
          id: `${equipmentId}-day${day}-9-18`,
          equipmentId,
          dayOfWeek: day,
          startHour: 9,
          endHour: 18,
        },
      })
    }
  }

  console.log('種子資料建立完成')
  console.log({ admin, user, equipment1, equipment2, equipment3, equipment4 })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
