import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // 嘗試建立示範設備資料
    const equipmentData = [
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

    // 建立設備
    for (const equipment of equipmentData) {
      await prisma.equipment.upsert({
        where: { id: equipment.id },
        update: equipment,
        create: equipment,
      })
    }

    // 建立時間段
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

    return Response.json({ 
      message: '資料庫初始化成功', 
      equipment: equipmentData.length,
      timeSlots: timeSlots.length 
    })
  } catch (error) {
    console.error('資料庫初始化失敗:', error)
    return Response.json({ error: '資料庫初始化失敗' }, { status: 500 })
  }
}
