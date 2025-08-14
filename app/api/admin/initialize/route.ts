import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    // 檢查是否已有管理員用戶
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (existingAdmin) {
      return NextResponse.json(
        { message: '管理員用戶已存在' },
        { status: 400 }
      );
    }

    // 建立預設管理員用戶
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: '系統管理員',
        role: 'ADMIN',
        password: hashedPassword,
      }
    });

    // 建立一些範例設備
    const equipment1 = await prisma.equipment.create({
      data: {
        name: '低溫槽 A',
        description: '主要低溫槽設備',
        isActive: true,
      }
    });

    const equipment2 = await prisma.equipment.create({
      data: {
        name: '低溫槽 B',
        description: '備用低溫槽設備',
        isActive: true,
      }
    });

    // 建立預設時段
    const timeSlots = [
      { startTime: '09:00', endTime: '10:00' },
      { startTime: '10:00', endTime: '11:00' },
      { startTime: '11:00', endTime: '12:00' },
      { startTime: '13:00', endTime: '14:00' },
      { startTime: '14:00', endTime: '15:00' },
      { startTime: '15:00', endTime: '16:00' },
      { startTime: '16:00', endTime: '17:00' },
    ];

    for (const slot of timeSlots) {
      await prisma.timeSlot.create({
        data: slot
      });
    }

    return NextResponse.json({
      message: '資料庫初始化成功',
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
    console.error('初始化錯誤:', error);
    return NextResponse.json(
      { message: '初始化失敗', error: error instanceof Error ? error.message : '未知錯誤' },
      { status: 500 }
    );
  }
}
