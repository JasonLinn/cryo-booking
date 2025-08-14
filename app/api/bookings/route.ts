import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendEmail, generateBookingApprovalEmail, generateBookingRejectionEmail } from '@/lib/email'
import { isBookingAvailable } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const userId = url.searchParams.get('userId')
    const publicView = url.searchParams.get('public') === 'true'

    const where: any = {}
    
    // 如果是公開檢視（用於日曆顯示）
    if (publicView) {
      if (status === 'all') {
        // 顯示所有狀態的預約，不設定狀態限制
      } else if (status) {
        // 顯示指定狀態的預約
        where.status = status
      } else {
        // 默認只顯示已核准的預約
        where.status = 'APPROVED'
      }
    } else {
      // 私有檢視模式，需要登入
      if (status) {
        where.status = status
      }
      // 需要登入才能查看詳細預約資訊
      if (!session) {
        return NextResponse.json(
          { error: '請先登入' },
          { status: 401 }
        )
      }

      // 一般使用者只能看自己的預約，管理員可以看所有預約
      if (session.user.role !== 'ADMIN') {
        where.userId = session.user.id
      } else if (userId) {
        where.userId = userId
      }
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        equipment: {
          select: {
            id: true,
            name: true,
            location: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('取得預約列表失敗:', error)
    return NextResponse.json(
      { error: '取得預約列表失敗' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const data = await request.json()
    const { equipmentId, startTime, endTime, purpose, guestName, guestEmail } = data

    // 檢查時間格式
    const start = new Date(startTime)
    const end = new Date(endTime)

    if (start >= end) {
      return NextResponse.json(
        { error: '結束時間必須晚於開始時間' },
        { status: 400 }
      )
    }

    if (start < new Date()) {
      return NextResponse.json(
        { error: '不能預約過去的時間' },
        { status: 400 }
      )
    }

    // 檢查設備是否存在
    const equipment = await prisma.equipment.findUnique({
      where: { id: equipmentId }
    })

    if (!equipment) {
      return NextResponse.json(
        { error: '指定的設備不存在' },
        { status: 400 }
      )
    }

    if (!equipment.isActive) {
      return NextResponse.json(
        { error: '設備目前不可用' },
        { status: 400 }
      )
    }

    // 檢查是否為可預約日期（非週末且非國定假日）
    if (!isBookingAvailable(start)) {
      return NextResponse.json(
        { error: '週末和國定假日不開放預約' },
        { status: 400 }
      )
    }

    // 檢查是否有衝突的預約
    const conflicts = await prisma.booking.findMany({
      where: {
        equipmentId,
        status: { in: ['PENDING', 'APPROVED'] },
        OR: [
          {
            startTime: { lt: end },
            endTime: { gt: start }
          }
        ]
      }
    })

    if (conflicts.length > 0) {
      return NextResponse.json(
        { error: '此時段已有其他預約' },
        { status: 400 }
      )
    }

    let userId: string

    if (session) {
      // 已登入使用者
      userId = session.user.id
    } else {
      // 訪客預約，需要提供姓名和 email
      if (!guestName || !guestEmail) {
        return NextResponse.json(
          { error: '請提供姓名和電子郵件' },
          { status: 400 }
        )
      }

      // 檢查是否已有此 email 的使用者
      let guestUser = await prisma.user.findUnique({
        where: { email: guestEmail }
      })

      if (!guestUser) {
        // 建立新的訪客使用者
        guestUser = await prisma.user.create({
          data: {
            email: guestEmail,
            name: guestName,
            role: 'USER'
          }
        })
      }

      userId = guestUser.id
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        equipmentId,
        startTime: start,
        endTime: end,
        purpose,
      },
      include: {
        equipment: true,
        user: true
      }
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error('建立預約失敗:', error)
    return NextResponse.json(
      { error: '建立預約失敗' },
      { status: 500 }
    )
  }
}
