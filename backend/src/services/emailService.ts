import sgMail from '@sendgrid/mail'

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

/**
 * Email configuration
 */
interface BookingConfirmationData {
    referenceNumber: string
    guestName: string
    guestEmail: string
    unitName: string
    checkInDate: string
    checkOutDate: string
    totalPrice: string
    nights: number
}

interface ReviewRequestData {
    guestEmail: string
    guestName: string
    referenceNumber: string
    unitName: string
}

/**
 * Send booking confirmation email to guest
 */
export async function sendBookingConfirmation(data: BookingConfirmationData) {
    try {
        const message = {
            to: data.guestEmail,
            from: process.env.SENDGRID_FROM_EMAIL || 'noreply@njoki-homestays.com',
            subject: `Booking Confirmation - ${data.referenceNumber} | Njoki Homestays`,
            html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #d2691e 0%, #2d5016 100%); color: white; padding: 20px; border-radius: 5px; }
              .header h1 { margin: 0; }
              .content { background: #f9fafb; padding: 20px; margin: 20px 0; border-radius: 5px; }
              .details { margin: 20px 0; }
              .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
              .detail-label { font-weight: bold; color: #6b7280; }
              .detail-value { color: #1f2937; }
              .button { display: inline-block; background: #d2691e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { color: #6b7280; font-size: 12px; text-align: center; padding: 20px 0; border-top: 1px solid #e5e7eb; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🏡 Booking Confirmation</h1>
              </div>
 
              <p>Dear ${data.guestName},</p>
 
              <p>Thank you for your booking with <strong>Njoki Homestays</strong>! We're excited to host you.</p>
 
              <div class="content">
                <h2 style="margin-top: 0;">Booking Details</h2>
                
                <div class="details">
                  <div class="detail-row">
                    <span class="detail-label">Reference Number:</span>
                    <span class="detail-value"><strong>${data.referenceNumber}</strong></span>
                  </div>
                  
                  <div class="detail-row">
                    <span class="detail-label">Unit:</span>
                    <span class="detail-value">${data.unitName}</span>
                  </div>
                  
                  <div class="detail-row">
                    <span class="detail-label">Check-in:</span>
                    <span class="detail-value">${new Date(data.checkInDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  
                  <div class="detail-row">
                    <span class="detail-label">Check-out:</span>
                    <span class="detail-value">${new Date(data.checkOutDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  
                  <div class="detail-row">
                    <span class="detail-label">Number of Nights:</span>
                    <span class="detail-value">${data.nights}</span>
                  </div>
                  
                  <div class="detail-row">
                    <span class="detail-label">Total Price:</span>
                    <span class="detail-value"><strong>KES ${parseFloat(data.totalPrice).toLocaleString()}</strong></span>
                  </div>
                </div>
              </div>
 
              <h2>Next Steps</h2>
              <ol>
                <li>Our team will review your booking within 24 hours</li>
                <li>You'll receive payment instructions via email or WhatsApp</li>
                <li>Once payment is confirmed, your booking is locked in</li>
                <li>Check-in instructions will be sent 2 days before arrival</li>
              </ol>
 
              <h2>Payment Methods</h2>
              <p>You can pay using any of these methods (reference your booking number):</p>
              <ul>
                <li><strong>M-Pesa:</strong> 0712 345 678 (send amount + reference)</li>
                <li><strong>Bank Transfer:</strong> Details will be sent separately</li>
                <li><strong>PayPal:</strong> A payment link will be provided</li>
              </ul>
 
              <h2>Questions?</h2>
              <p>
                <strong>WhatsApp:</strong> +254712345678<br>
                <strong>Email:</strong> support@njoki-homestays.com<br>
                <strong>Website:</strong> https://njoki-homestays.com
              </p>
 
              <p>We look forward to hosting you!</p>
 
              <div class="footer">
                <p>© 2024 Njoki Homestays. All rights reserved.</p>
                <p>This is an automated message. Please do not reply to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `,
        }

        await sgMail.send(message)
        console.log(`✅ Booking confirmation email sent to ${data.guestEmail}`)
        return { success: true, email: data.guestEmail }
    } catch (error) {
        console.error('❌ Failed to send booking confirmation email:', error)
        throw error
    }
}

/**
 * Send review request email to guest
 */
export async function sendReviewRequest(data: ReviewRequestData) {
    try {
        const message = {
            to: data.guestEmail,
            from: process.env.SENDGRID_FROM_EMAIL || 'noreply@njoki-homestays.com',
            subject: `Share Your Experience - Njoki Homestays (${data.referenceNumber})`,
            html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #d2691e 0%, #2d5016 100%); color: white; padding: 20px; border-radius: 5px; }
              .header h1 { margin: 0; }
              .content { background: #f9fafb; padding: 20px; margin: 20px 0; border-radius: 5px; }
              .button { display: inline-block; background: #d2691e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { color: #6b7280; font-size: 12px; text-align: center; padding: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>⭐ Share Your Experience</h1>
              </div>
 
              <p>Dear ${data.guestName},</p>
 
              <p>We hope you had an amazing stay at <strong>${data.unitName}</strong>!</p>
 
              <p>Your feedback helps us improve and helps other travelers find great accommodations. Would you mind sharing your experience?</p>
 
              <p>
                <a href="https://njoki-homestays.com/review/${data.referenceNumber}" class="button">
                  Write Your Review
                </a>
              </p>
 
              <p>It takes just 2 minutes and really makes a difference!</p>
 
              <p>
                Best regards,<br>
                <strong>Njoki Homestays Team</strong>
              </p>
 
              <div class="footer">
                <p>© 2024 Njoki Homestays. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
        }

        await sgMail.send(message)
        console.log(`✅ Review request email sent to ${data.guestEmail}`)
        return { success: true, email: data.guestEmail }
    } catch (error) {
        console.error('❌ Failed to send review request email:', error)
        throw error
    }
}

/**
 * Send admin notification about new booking
 */
export async function sendAdminNotification(data: BookingConfirmationData) {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@njoki-homestays.com'

        const message = {
            to: adminEmail,
            from: process.env.SENDGRID_FROM_EMAIL || 'noreply@njoki-homestays.com',
            subject: `New Booking - ${data.referenceNumber}`,
            html: `
        <h2>New Booking Received</h2>
        <p><strong>Reference:</strong> ${data.referenceNumber}</p>
        <p><strong>Guest:</strong> ${data.guestName}</p>
        <p><strong>Email:</strong> ${data.guestEmail}</p>
        <p><strong>Unit:</strong> ${data.unitName}</p>
        <p><strong>Check-in:</strong> ${data.checkInDate}</p>
        <p><strong>Check-out:</strong> ${data.checkOutDate}</p>
        <p><strong>Total Price:</strong> KES ${parseFloat(data.totalPrice).toLocaleString()}</p>
      `,
        }

        await sgMail.send(message)
        console.log(`✅ Admin notification sent for booking ${data.referenceNumber}`)
        return { success: true }
    } catch (error) {
        console.error('❌ Failed to send admin notification:', error)
        // Don't throw - admin notification failure shouldn't block booking
        return { success: false }
    }
}

/**
 * Send payment confirmation email
 */
export async function sendPaymentConfirmation(
    guestEmail: string,
    guestName: string,
    referenceNumber: string,
    amount: string
) {
    try {
        const message = {
            to: guestEmail,
            from: process.env.SENDGRID_FROM_EMAIL || 'noreply@njoki-homestays.com',
            subject: `Payment Confirmed - ${referenceNumber} | Njoki Homestays`,
            html: `
        <h2>Payment Confirmed</h2>
        <p>Dear ${guestName},</p>
        <p>We have received your payment of <strong>KES ${parseFloat(amount).toLocaleString()}</strong> for booking <strong>${referenceNumber}</strong>.</p>
        <p>Your reservation is now confirmed! Check-in instructions will be sent 2 days before your arrival.</p>
        <p>Thank you for choosing Njoki Homestays!</p>
      `,
        }

        await sgMail.send(message)
        console.log(`✅ Payment confirmation email sent to ${guestEmail}`)
        return { success: true }
    } catch (error) {
        console.error('❌ Failed to send payment confirmation:', error)
        throw error
    }
}