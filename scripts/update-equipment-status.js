const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateEquipmentStatus() {
  console.log('🔄 正在更新設備狀態...')

  const updates = [
    { name: '設備 A', status: 'AVAILABLE' },
    { name: '設備 B', status: 'ASK_ADMIN' },
    { name: '設備 C', status: 'PREPARING' },
    { name: '設備 D', status: 'MAINTENANCE' },
    { name: '設備 E', status: 'UNAVAILABLE' }
  ]

  for (const update of updates) {
    try {
      const result = await prisma.equipment.updateMany({
        where: { name: update.name },
        data: { status: update.status }
      })
      
      if (result.count > 0) {
        console.log(`✅ 更新 ${update.name} 狀態為: ${update.status}`)
      } else {
        console.log(`⚠️  找不到設備: ${update.name}`)
      }
    } catch (error) {
      console.error(`❌ 更新 ${update.name} 失敗:`, error.message)
    }
  }

  console.log('🎉 設備狀態更新完成！')
}

updateEquipmentStatus()
  .catch((e) => {
    console.error('❌ 更新失敗:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
