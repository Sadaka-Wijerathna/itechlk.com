import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: process.env.EMAIL_SERVER_PORT === '465', // common convention
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export const sendVerificationEmail = async (email: string, code: string) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"ITechLK Store" <noreply@itechlk.com>',
    to: email,
    subject: 'Verify your email - ITechLK Store',
    text: `Your verification code is: ${code}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: #333; text-align: center;">Email Verification</h2>
        <p>Hello,</p>
        <p>Thank you for registering at ITechLK Store. Please use the following code to verify your email address:</p>
        <div style="background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #d55433; margin: 20px 0;">
          ${code}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999; text-align: center;">&copy; 2026 ITechLK Store. All rights reserved.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://itechlk.com';
  const resetUrl = `${siteUrl}/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"ITechLK Store" <noreply@itechlk.com>',
    to: email,
    subject: 'Reset your password - ITechLK Store',
    text: `You requested a password reset. Please use the following link to reset your password: ${resetUrl}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password for your account at ITechLK Store. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #d55433; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #555;"><a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link will expire in 1 hour. If you did not request a password reset, please ignore this email; your password will remain secure.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999; text-align: center;">&copy; 2026 ITechLK Store. All rights reserved.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendOrderStatusEmail = async (order: any) => {
  const isConfirmed = order.status === 'Confirmed';
  const subject = isConfirmed 
    ? `Order Confirmed - ITechLK Store (Order #${order.id.slice(-6).toUpperCase()})`
    : `Order Update - ITechLK Store (Order #${order.id.slice(-6).toUpperCase()})`;

  const statusText = isConfirmed 
    ? `<strong>Confirmed</strong>! We have verified your payment receipt and your subscription details are being prepared for delivery.`
    : `<strong>Rejected</strong>. We were unable to verify your bank transfer receipt. Please check your bank transaction and contact us on WhatsApp if this is a mistake.`;

  const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : new Date().toLocaleDateString();

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"ITechLK Store" <noreply@itechlk.com>',
    to: order.email,
    subject,
    text: `Hello ${order.firstName}, your order #${order.id.slice(-6).toUpperCase()} status is now ${order.status}.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: #333; text-align: center;">Order Status Update</h2>
        <p>Hello ${order.firstName} ${order.lastName},</p>
        <p>Your order status has been updated to ${statusText}</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <h4 style="margin-top: 0;">Order Summary:</h4>
          <p style="margin: 5px 0;"><strong>Order ID:</strong> #${order.id.slice(-6).toUpperCase()}</p>
          <p style="margin: 5px 0;"><strong>Total Amount:</strong> USD ${order.totalAmount}</p>
          <p style="margin: 5px 0;"><strong>Order Date:</strong> ${orderDate}</p>
        </div>

        <p>If you have any questions or would like to send payment confirmation, please contact us on WhatsApp at +94 74 257 0943.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999; text-align: center;">&copy; 2026 ITechLK Store. All rights reserved.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};
