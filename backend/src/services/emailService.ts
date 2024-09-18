import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions) => {
  const msg = {
    to: options.to,
    from: process.env.FROM_EMAIL!, // Set this in your environment variables
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${options.to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

export const sendVerificationEmail = async (email: string, token: string, temporaryPassword: string) => {
  console.log('Sending verification email to:', email);
  const verificationLink = `${process.env.FRONTEND_URL}/set-password?token=${token}`;
  
  try {
    await sendEmail({
      to: email,
      subject: 'Verify Your Email and Set Password',
      text: `Please verify your email and set your password by clicking this link: ${verificationLink}. Your temporary password is: ${temporaryPassword}`,
      html: `<p>Please <a href="${verificationLink}">verify your email and set your password</a>.</p><p>Your temporary password is: ${temporaryPassword}</p>`
    });
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await sendEmail({
    to: email,
    subject: 'Reset Your Password',
    text: `Click this link to reset your password: ${resetLink}`,
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
  });
};

export const sendOrderConfirmationEmail = async (email: string, orderDetails: any) => {
  // Implement order confirmation email logic here
  await sendEmail({
    to: email,
    subject: 'Order Confirmation',
    text: `Your order has been confirmed. Order ID: ${orderDetails.id}`,
    html: `<h1>Order Confirmed</h1><p>Your order (ID: ${orderDetails.id}) has been confirmed.</p>`
  });
};