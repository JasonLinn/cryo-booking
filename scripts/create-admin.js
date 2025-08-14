const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdminUser() {
  console.log('🔑 建立管理員帳戶...')

  const adminEmail = 'admin@localhost'
  const adminPassword = 'admin123'

  // 檢查管理員是否已存在
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (existingAdmin) {
    console.log('⚠️  管理員帳戶已存在')
    console.log(`📧 Email: ${adminEmail}`)
    return
  }

  // 加密密碼
  const hashedPassword = await bcrypt.hash(adminPassword, 12)

  // 建立管理員帳戶
  const admin = await prisma.user.create({
    data: {
      name: '系統管理員',
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    }
  })

  console.log('✅ 管理員帳戶建立成功！')
  console.log(`📧 Email: ${adminEmail}`)
  console.log(`🔐 密碼: ${adminPassword}`)
  console.log(`👤 姓名: ${admin.name}`)
  console.log(`🔑 角色: ${admin.role}`)
  console.log('')
  console.log('🚨 請記得在正式環境中更改預設密碼！')
}

createAdminUser()
  .catch((e) => {
    console.error('❌ 建立管理員帳戶失敗:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
