const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedEquipment() {
  console.log('🌱 正在建立設備...')

  const equipments = [
    {
      name: '設備 A',
      description: '冷凍乾燥設備 A',
      location: '實驗室 A 區',
      color: '#FF6B6B', // 紅色
    },
    {
      name: '設備 B', 
      description: '冷凍乾燥設備 B',
      location: '實驗室 B 區',
      color: '#4ECDC4', // 藍綠色
    },
    {
      name: '設備 C',
      description: '冷凍乾燥設備 C', 
      location: '實驗室 C 區',
      color: '#45B7D1', // 藍色
    },
    {
      name: '設備 D',
      description: '冷凍乾燥設備 D',
      location: '實驗室 D 區', 
      color: '#96CEB4', // 綠色
    },
  ]

  for (const equipment of equipments) {
    const existingEquipment = await prisma.equipment.findFirst({
      where: { name: equipment.name }
    })

    if (!existingEquipment) {
      const created = await prisma.equipment.create({
        data: equipment
      })
      console.log(`✅ 建立設備: ${created.name} (顏色: ${created.color})`)
    } else {
      console.log(`⚠️  設備已存在: ${equipment.name}`)
    }
  }

  // 為每個設備建立時間段 (週一到週五 9:00-17:00)
  const allEquipments = await prisma.equipment.findMany()
  
  for (const equipment of allEquipments) {
    const existingTimeSlots = await prisma.timeSlot.findMany({
      where: { equipmentId: equipment.id }
    })

    if (existingTimeSlots.length === 0) {
      for (let dayOfWeek = 1; dayOfWeek <= 5; dayOfWeek++) { // 週一到週五
        await prisma.timeSlot.create({
          data: {
            equipmentId: equipment.id,
            dayOfWeek,
            startHour: 9,
            endHour: 17,
            isActive: true
          }
        })
      }
      console.log(`⏰ 為 ${equipment.name} 建立時間段 (週一至週五 9:00-17:00)`)
    }
  }

  console.log('🎉 設備種子資料建立完成！')
}

seedEquipment()
  .catch((e) => {
    console.error('❌ 種子資料建立失敗:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
