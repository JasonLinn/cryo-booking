import nodemailer from 'nodemailer'

// 建立 Gmail SMTP 傳輸器
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export interface EmailTemplate {
  to: string
  subject: string
  html: string
  cc?: string[]
}

export async function sendEmail({ to, subject, html, cc }: EmailTemplate) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('郵件服務未設定 (缺少 SMTP 設定)，跳過發送郵件')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: {
        name: process.env.FROM_NAME || 'CRYO-預約系統',
        address: process.env.FROM_EMAIL || process.env.SMTP_USER,
      },
      to,
      cc,
      subject,
      html,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('郵件發送成功:', info.messageId)
    
    return { success: true, data: info }
  } catch (error) {
    console.error('郵件發送失敗:', error)
    return { success: false, error }
  }
}

export function generateBookingRequestEmail(
  userName: string,
  equipmentName: string,
  startTime: Date,
  endTime: Date,
  purpose?: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>預約申請通知</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
        <h2 style="color: #007bff;">收到新的預約申請 📅</h2>
        
        <p>親愛的 ${userName}，</p>
        
        <p>您的設備預約申請已送出，正在等待管理員審核：</p>
        
        <div style="background-color: white; padding: 15px; border-radius: 4px; margin: 15px 0;">
          <p><strong>設備名稱：</strong>${equipmentName}</p>
          <p><strong>使用時間：</strong>${startTime.toLocaleString('zh-TW')} - ${endTime.toLocaleString('zh-TW')}</p>
          ${purpose ? `<p><strong>使用目的：</strong>${purpose}</p>` : ''}
        </div>
        
        <p>我們會儘快處理您的申請，並以電子郵件通知您審核結果。</p>
        
        <p>感謝您的申請！</p>
        
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          此為系統自動發送的郵件，請勿直接回覆。
        </p>
      </div>
    </body>
    </html>
  `
}

export function generateAdminNotificationEmail(
  userName: string,
  userEmail: string,
  equipmentName: string,
  startTime: Date,
  endTime: Date,
  purpose?: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>新預約申請 - 管理員通知</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
        <h2 style="color: #dc3545;">收到新的預約申請 🔔</h2>
        
        <p>管理員您好，</p>
        
        <p>有新的設備預約申請需要您的審核：</p>
        
        <div style="background-color: white; padding: 15px; border-radius: 4px; margin: 15px 0;">
          <p><strong>申請人：</strong>${userName}</p>
          <p><strong>聯絡信箱：</strong>${userEmail}</p>
          <p><strong>設備名稱：</strong>${equipmentName}</p>
          <p><strong>使用時間：</strong>${startTime.toLocaleString('zh-TW')} - ${endTime.toLocaleString('zh-TW')}</p>
          ${purpose ? `<p><strong>使用目的：</strong>${purpose}</p>` : ''}
        </div>
        
        <p>請至管理後台進行審核作業。</p>
        
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          此為系統自動發送的郵件，請勿直接回覆。
        </p>
      </div>
    </body>
    </html>
  `
}

export function generateBookingApprovalEmail(
  userName: string,
  equipmentName: string,
  startTime: Date,
  endTime: Date
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>預約核准通知</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
        <h2 style="color: #28a745;">預約已核准 ✅</h2>
        
        <p>親愛的 ${userName}，</p>
        
        <p>您的設備預約申請已被核准：</p>
        
        <div style="background-color: white; padding: 15px; border-radius: 4px; margin: 15px 0;">
          <p><strong>設備名稱：</strong>${equipmentName}</p>
          <p><strong>使用時間：</strong>${startTime.toLocaleString('zh-TW')} - ${endTime.toLocaleString('zh-TW')}</p>
        </div>
        
        <p>請準時使用設備，如有任何問題請聯繫管理員。</p>
        
        <p>祝您實驗順利！</p>
        
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          此為系統自動發送的郵件，請勿直接回覆。
        </p>
      </div>
    </body>
    </html>
  `
}

export function generateBookingRejectionEmail(
  userName: string,
  equipmentName: string,
  startTime: Date,
  endTime: Date,
  reason?: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>預約拒絕通知</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
        <h2 style="color: #dc3545;">預約已拒絕 ❌</h2>
        
        <p>親愛的 ${userName}，</p>
        
        <p>很抱歉，您的設備預約申請已被拒絕：</p>
        
        <div style="background-color: white; padding: 15px; border-radius: 4px; margin: 15px 0;">
          <p><strong>設備名稱：</strong>${equipmentName}</p>
          <p><strong>申請時間：</strong>${startTime.toLocaleString('zh-TW')} - ${endTime.toLocaleString('zh-TW')}</p>
          ${reason ? `<p><strong>拒絕原因：</strong>${reason}</p>` : ''}
        </div>
        
        <p>如有疑問，請聯繫管理員或重新提交申請。</p>
        
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          此為系統自動發送的郵件，請勿直接回覆。
        </p>
      </div>
    </body>
    </html>
  `
}
