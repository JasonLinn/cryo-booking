import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { 
  sendEmail, 
  generateBookingApprovalEmail, 
  generateBookingRejectionEmail
} from '@/lib/email'

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
      const recipientName = booking.user?.name || 'User'
      const recipientEmail = booking.user?.email
      
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

        // 同時通知管理員審核結果（副本）
        const adminEmail = process.env.ADMIN_EMAIL
        if (adminEmail && adminEmail !== recipientEmail) {
          await sendEmail({
            to: adminEmail,
            subject: `預約審核完成 - ${status === 'APPROVED' ? '已核准' : '已拒絕'}`,
            html: `
              <p>管理員您好，</p>
              <p>預約審核已完成：</p>
              <ul>
                <li>申請人：${recipientName} (${recipientEmail})</li>
                <li>設備：${booking.equipment.name}</li>
                <li>時間：${booking.startTime.toLocaleString('zh-TW')} - ${booking.endTime.toLocaleString('zh-TW')}</li>
                <li>審核結果：${status === 'APPROVED' ? '核准' : '拒絕'}</li>
                ${adminNotes ? `<li>備註：${adminNotes}</li>` : ''}
              </ul>
            `
          })
        }
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

    // 檢查預約是否存在
    const existingBooking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        equipment: true
      }
    })

    if (!existingBooking) {
      return NextResponse.json(
        { error: '預約不存在' },
        { status: 404 }
      )
    }

    // 刪除預約
    await prisma.booking.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      { message: '預約已成功刪除' },
      { status: 200 }
    )
  } catch (error) {
    console.error('刪除預約失敗:', error)
    return NextResponse.json(
      { error: '刪除預約失敗' },
      { status: 500 }
    )
  }
}
