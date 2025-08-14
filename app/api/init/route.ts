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

    // 建立時間段 (週一到週五，9AM-6PM)
    const timeSlots = []
    
    // 為每個設備建立時間段
    for (const equipment of equipmentData) {
      // 週一到週五 (1-5)
      for (let dayOfWeek = 1; dayOfWeek <= 5; dayOfWeek++) {
        // 9AM to 6PM (每小時一個時段)
        for (let hour = 9; hour < 18; hour++) {
          timeSlots.push({
            equipmentId: equipment.id,
            dayOfWeek: dayOfWeek,
            startHour: hour,
            endHour: hour + 1,
            isActive: true,
          })
        }
      }
    }

    for (const slot of timeSlots) {
      const existing = await prisma.timeSlot.findFirst({
        where: {
          equipmentId: slot.equipmentId,
          dayOfWeek: slot.dayOfWeek,
          startHour: slot.startHour,
          endHour: slot.endHour,
        }
      });
      
      if (!existing) {
        await prisma.timeSlot.create({
          data: slot,
        });
      }
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
