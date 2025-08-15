import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
// import { authOptions } from '@/lib/auth'
import { sendEmail, generateBookingApprovalEmail, generateBookingRejectionEmail } from '@/lib/email'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // const session = await getServerSession(authOptions)
    const session = null // 暫時禁用認證
    
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json(
    //     { error: '權限不足' },
    //     { status: 403 }
    //   )
    // }

    const data = await request.json()
    const { status, adminNotes } = data

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: '無效的狀態' },
        { status: 400 }
      )
    }

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status,
        rejectionReason: adminNotes,
        updatedAt: new Date()
      },
      include: {
        user: true,
        equipment: true
      }
    })

    // 發送郵件通知
    try {
      const recipientName = booking.user?.name || booking.guestName || 'User'
      const recipientEmail = booking.user?.email || booking.guestEmail
      
      if (recipientEmail) {
        const emailTemplate = status === 'APPROVED' 
          ? generateBookingApprovalEmail(
              recipientName,
              booking.equipment.name,
              booking.startTime,
              booking.endTime
            )
          : generateBookingRejectionEmail(
              recipientName,
              booking.equipment.name,
              booking.startTime,
              booking.endTime,
              adminNotes
            )

        await sendEmail({
          to: recipientEmail,
          subject: status === 'APPROVED' ? '預約已核准' : '預約已拒絕',
          html: emailTemplate
        })
      }
    } catch (emailError) {
      console.error('郵件發送失敗:', emailError)
      // 即使郵件發送失敗，也不影響預約狀態更新
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error('審核預約失敗:', error)
    return NextResponse.json(
      { error: '審核預約失敗' },
      { status: 500 }
    )
  }
}
