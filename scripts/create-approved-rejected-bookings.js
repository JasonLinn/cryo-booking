import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createApprovedAndRejectedBookings() {
  try {
    // 獲取現有設備
    const equipment = await prisma.equipment.findMany()
    
    if (equipment.length === 0) {
      console.log('沒有找到設備，請先運行基本測試資料腳本')
      return
    }

    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    
    const twoDaysAgo = new Date(now)
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

    // 建立一些已核准的預約
    await prisma.booking.create({
      data: {
        equipmentId: equipment[0].id,
        guestName: '已核准訪客 1',
        guestEmail: 'approved1@example.com',
        startTime: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 10, 0),
        endTime: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 12, 0),
        purpose: '研究項目 - 已核准',
        status: 'APPROVED',
        updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000) // 2小時前
      }
    })

    await prisma.booking.create({
      data: {
        equipmentId: equipment[1] ? equipment[1].id : equipment[0].id,
        guestName: '已核准訪客 2',
        guestEmail: 'approved2@example.com',
        startTime: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 14, 0),
        endTime: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 16, 0),
        purpose: '產品測試 - 已核准',
        status: 'APPROVED',
        updatedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000) // 3小時前
      }
    })

    // 建立一些已拒絕的預約
    await prisma.booking.create({
      data: {
        equipmentId: equipment[0].id,
        guestName: '已拒絕訪客 1',
        guestEmail: 'rejected1@example.com',
        startTime: new Date(twoDaysAgo.getFullYear(), twoDaysAgo.getMonth(), twoDaysAgo.getDate(), 9, 0),
        endTime: new Date(twoDaysAgo.getFullYear(), twoDaysAgo.getMonth(), twoDaysAgo.getDate(), 11, 0),
        purpose: '衝突時段預約',
        status: 'REJECTED',
        rejectionReason: '該時段設備已被預約',
        updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) // 1天前
      }
    })

    await prisma.booking.create({
      data: {
        equipmentId: equipment[1] ? equipment[1].id : equipment[0].id,
        guestName: '已拒絕訪客 2',
        guestEmail: 'rejected2@example.com',
        startTime: new Date(twoDaysAgo.getFullYear(), twoDaysAgo.getMonth(), twoDaysAgo.getDate(), 15, 0),
        endTime: new Date(twoDaysAgo.getFullYear(), twoDaysAgo.getMonth(), twoDaysAgo.getDate(), 17, 0),
        purpose: '維護期間預約',
        status: 'REJECTED',
        rejectionReason: '設備正在維護中，無法使用',
        updatedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000) // 6小時前
      }
    })

    await prisma.booking.create({
      data: {
        equipmentId: equipment[0].id,
        guestName: '已拒絕訪客 3',
        guestEmail: 'rejected3@example.com',
        startTime: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 8, 0),
        endTime: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 9, 0),
        purpose: '資格不符的預約',
        status: 'REJECTED',
        rejectionReason: '申請人不具備使用該設備的資格',
        updatedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000) // 4小時前
      }
    })

    console.log('已建立測試資料：')
    console.log('- 2 個已核准預約')
    console.log('- 3 個已拒絕預約')
    console.log('現在可以在管理員儀表板查看完整的預約狀態')

  } catch (error) {
    console.error('建立測試資料失敗:', error)
  }
}

createApprovedAndRejectedBookings()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
