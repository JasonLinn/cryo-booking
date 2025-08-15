import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EquipmentStatus } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    // 刪除所有資料並重新初始化
    await prisma.booking.deleteMany();
    await prisma.timeSlot.deleteMany();
    await prisma.equipment.deleteMany();
    await prisma.user.deleteMany();

    console.log('所有資料已清除，重新初始化...');

    // 重新建立管理員用戶
    const hashedPassword = await (await import('bcryptjs')).default.hash('admin123', 12);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: '系統管理員',
        role: 'ADMIN',
        password: hashedPassword,
      }
    });

    // 建立設備
    const equipment1 = await prisma.equipment.create({
      data: {
        name: '低溫槽 A',
        description: '主要低溫槽設備',
        status: EquipmentStatus.AVAILABLE,
      }
    });

    const equipment2 = await prisma.equipment.create({
      data: {
        name: '低溫槽 B',
        description: '備用低溫槽設備',
        status: EquipmentStatus.AVAILABLE,
      }
    });

    // 建立時段資料
    const timeSlots = [];
    for (let dayOfWeek = 1; dayOfWeek <= 5; dayOfWeek++) { // Monday to Friday
      for (let hour = 9; hour < 17; hour++) {
        timeSlots.push({
          equipmentId: equipment1.id,
          dayOfWeek,
          startHour: hour,
          endHour: hour + 1,
          isActive: true
        });
        timeSlots.push({
          equipmentId: equipment2.id,
          dayOfWeek,
          startHour: hour,
          endHour: hour + 1,
          isActive: true
        });
      }
    }

    for (const slot of timeSlots) {
      await prisma.timeSlot.create({
        data: slot
      });
    }

    return NextResponse.json({
      message: '資料庫重置並初始化成功',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      },
      equipment: [equipment1, equipment2],
      timeSlotsCount: timeSlots.length
    });

  } catch (error) {
    console.error('重置資料庫失敗:', error);
    return NextResponse.json(
      { message: '重置失敗', error: error instanceof Error ? error.message : '未知錯誤' },
      { status: 500 }
    );
  }
}
