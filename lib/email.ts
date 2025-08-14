import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export interface EmailTemplate {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailTemplate) {
  if (!resend) {
    console.warn('郵件服務未設定 (缺少 RESEND_API_KEY)，跳過發送郵件')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const data = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@example.com',
      to,
      subject,
      html,
    })
    
    return { success: true, data }
  } catch (error) {
    console.error('郵件發送失敗:', error)
    return { success: false, error }
  }
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
