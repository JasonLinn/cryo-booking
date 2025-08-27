import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
// import { authOptions } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // const session = await getServerSession(authOptions)
    
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json(
    //     { error: '權限不足' },
    //     { status: 403 }
    //   )
    // }

    const { color, name, description, location, status } = await request.json()
    
    const equipment = await prisma.equipment.update({
      where: { id: params.id },
      data: {
        ...(color !== undefined && { color }),
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(location !== undefined && { location }),
        ...(status !== undefined && { status }),
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
    // const session = await getServerSession(authOptions)
    
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json(
    //     { error: '權限不足' },
    //     { status: 403 }
    //   )
    // }

    // 檢查是否有相關預約
    const bookingsCount = await prisma.booking.count({
      where: { equipmentId: params.id }
    })

    // 無論是否有預約，都直接刪除設備
    // 由於資料庫外鍵約束，相關的預約也會被處理（根據 schema 設定）
    await prisma.equipment.delete({
      where: { id: params.id }
    })
    
    const message = bookingsCount > 0 
      ? `設備已刪除（包含 ${bookingsCount} 個相關預約）`
      : '設備已刪除'
    
    return NextResponse.json({
      message
    })
  } catch (error) {
    console.error('刪除設備失敗:', error)
    
    // 如果是外鍵約束錯誤，提供更友好的錯誤訊息
    if (error instanceof Error && error.message.includes('foreign key constraint')) {
      return NextResponse.json(
        { error: '無法刪除設備：此設備有相關的預約記錄。請先處理相關預約後再刪除。' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: '刪除設備失敗' },
      { status: 500 }
    )
  }
}
