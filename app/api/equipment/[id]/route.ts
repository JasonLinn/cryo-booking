import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '權限不足' },
        { status: 403 }
      )
    }

    const { color, name, description, location, isActive } = await request.json()
    
    const equipment = await prisma.equipment.update({
      where: { id: params.id },
      data: {
        ...(color !== undefined && { color }),
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(location !== undefined && { location }),
        ...(isActive !== undefined && { isActive }),
      }
    })

    return NextResponse.json(equipment)
  } catch (error) {
    console.error('更新設備失敗:', error)
    return NextResponse.json(
      { error: '更新設備失敗' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '權限不足' },
        { status: 403 }
      )
    }

    // 檢查是否有相關預約
    const bookingsCount = await prisma.booking.count({
      where: { equipmentId: params.id }
    })

    if (bookingsCount > 0) {
      // 如果有預約，只標記為不啟用
      const equipment = await prisma.equipment.update({
        where: { id: params.id },
        data: { isActive: false }
      })
      
      return NextResponse.json({
        message: '設備已停用（因為有相關預約記錄）',
        equipment
      })
    } else {
      // 如果沒有預約，可以完全刪除
      await prisma.equipment.delete({
        where: { id: params.id }
      })
      
      return NextResponse.json({
        message: '設備已刪除'
      })
    }
  } catch (error) {
    console.error('刪除設備失敗:', error)
    return NextResponse.json(
      { error: '刪除設備失敗' },
      { status: 500 }
    )
  }
}
