import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const equipment = await prisma.equipment.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            bookings: {
              where: {
                status: 'APPROVED',
                startTime: {
                  gte: new Date()
                }
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(equipment)
  } catch (error) {
    console.error('取得設備列表失敗:', error)
    return NextResponse.json(
      { error: '取得設備列表失敗' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '權限不足' },
        { status: 403 }
      )
    }

    const data = await request.json()
    const { name, description, location } = data

    const equipment = await prisma.equipment.create({
      data: {
        name,
        description,
        location,
      }
    })

    return NextResponse.json(equipment)
  } catch (error) {
    console.error('建立設備失敗:', error)
    return NextResponse.json(
      { error: '建立設備失敗' },
      { status: 500 }
    )
  }
}
