import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

// 防止靜態生成時調用
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // 檢查是否已有設備，避免重複初始化
    const existingEquipment = await prisma.equipment.count()
    if (existingEquipment > 0) {
      return Response.json({ 
        message: '資料庫已經初始化', 
        equipment: existingEquipment,
        note: '如需重新初始化，請使用清理腳本'
      })
    }

    // 建立設備 A、B、C、D (與 seed-equipment.js 一致)
    const equipmentData = [
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

    // 批量建立設備
    const createdEquipment = await prisma.equipment.createMany({
      data: equipmentData,
      skipDuplicates: true
    })

    // 批量建立時間段 (週一到週五 9:00-17:00)
    const timeSlots = []
    const equipments = await prisma.equipment.findMany()
    
    for (const equipment of equipments) {
      for (let dayOfWeek = 1; dayOfWeek <= 5; dayOfWeek++) {
        timeSlots.push({
          equipmentId: equipment.id,
          dayOfWeek: dayOfWeek,
          startHour: 9,
          endHour: 17,
          isActive: true,
        })
      }
    }

    const createdTimeSlots = await prisma.timeSlot.createMany({
      data: timeSlots,
      skipDuplicates: true
    })

    return Response.json({ 
      message: '資料庫初始化成功', 
      equipment: createdEquipment.count,
      timeSlots: createdTimeSlots.count 
    })
  } catch (error) {
    console.error('資料庫初始化失敗:', error)
    return Response.json({ error: '資料庫初始化失敗' }, { status: 500 })
  }
}
