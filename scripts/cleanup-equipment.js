const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function cleanupEquipment() {
  console.log('🧹 清理設備資料...')

  try {
    // 1. 刪除所有現有設備 (這會級聯刪除相關的時間段和預約)
    const deletedBookings = await prisma.booking.deleteMany()
    console.log(`🗑️  刪除了 ${deletedBookings.count} 個預約`)

    const deletedTimeSlots = await prisma.timeSlot.deleteMany()
    console.log(`🗑️  刪除了 ${deletedTimeSlots.count} 個時間段`)

    const deletedEquipment = await prisma.equipment.deleteMany()
    console.log(`🗑️  刪除了 ${deletedEquipment.count} 個設備`)

    // 2. 重新建立我們需要的4個設備
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
      const created = await prisma.equipment.create({
        data: equipment
      })
      console.log(`✅ 建立設備: ${created.name} (顏色: ${created.color})`)
    }

    // 3. 為每個設備建立時間段 (週一到週五 9:00-17:00)
    const allEquipments = await prisma.equipment.findMany()
    
    for (const equipment of allEquipments) {
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

    console.log('🎉 設備清理和重建完成！')
    console.log(`📊 最終結果: ${allEquipments.length} 個設備`)

  } catch (error) {
    console.error('❌ 清理失敗:', error)
    process.exit(1)
  }
}

cleanupEquipment()
  .finally(async () => {
    await prisma.$disconnect()
  })
