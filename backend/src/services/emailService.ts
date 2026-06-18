import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

export interface BookingConfirmationData {
  referenceNumber: string
  guestName: string
  guestEmail: string
  unitName: string
  checkInDate: string
  checkOutDate: string
  totalPrice: string
  nights: number
}

export async function sendBookingConfirmation(data: BookingConfirmationData) {
  try {
    const message = {
      to: data.guestEmail,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@njoki-homestays.com',
      subject: \`Booking Confirmation - \${data.referenceNumber}\`,
      html: \`
        <h2>Thank you for your booking!</h2>
        <p>Dear \${data.guestName},</p>
        
        <h3>Booking Details</h3>
        <ul>
          <li><strong>Reference Number:</strong> \${data.referenceNumber}</li>
          <li><strong>Unit:</strong> \${data.unitName}</li>
          <li><strong>Check-in:</strong> \${data.checkInDate}</li>
          <li><strong>Check-out:</strong> \${data.checkOutDate}</li>
          <li><strong>Nights:</strong> \${data.nights}</li>
          <li><strong>Total Price:</strong> KES \${data.totalPrice}</li>
        </ul>
        
        <h3>Next Steps</h3>
        <p>Our team will review your booking and contact you within 24 hours with payment instructions.</p>
        
        <p>Questions? Contact us on WhatsApp: +254712345678</p>
        
        <p>Best regards,<br>Njoki Homestays Team</p>
      \`,
    }

    await sgMail.send(message)
    console.log('✓ Booking confirmation email sent to', data.guestEmail)
  } catch (error) {
    console.error('✗ Failed to send email:', error)
    throw error
  }
}

export async function sendReviewRequest(
  guestEmail: string,
  guestName: string,
  referenceNumber: string
) {
  try {
    const message = {
      to: guestEmail,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@njoki-homestays.com',
      subject: 'Share Your Experience - Njoki Homestays Review',
      html: \`
        <h2>We'd love your feedback!</h2>
        <p>Dear \${guestName},</p>
        
        <p>Thank you for staying with us. We would appreciate your review of your experience.</p>
        
        <p><strong>Booking Reference:</strong> \${referenceNumber}</p>
        
        <p><a href="https://njoki-homestays.com/review/\${referenceNumber}">Share Your Review</a></p>
        
        <p>Best regards,<br>Njoki Homestays Team</p>
      \`,
    }

    await sgMail.send(message)
    console.log('✓ Review request email sent to', guestEmail)
  } catch (error) {
    console.error('✗ Failed to send review request:', error)
    throw error
  }
}
