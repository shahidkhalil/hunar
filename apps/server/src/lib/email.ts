import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

export async function sendOrderConfirmation(email: string, orderData: any) {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "Hunar <noreply@hunar.com>",
      to: email,
      subject: `Order Confirmation - #${orderData.id.slice(0, 8)}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6B4F3B;">Thank you for your order!</h1>
          <p>Your order has been confirmed and will be processed soon.</p>
          <h2 style="color: #2B2B2B;">Order Details</h2>
          <p><strong>Order ID:</strong> ${orderData.id}</p>
          <p><strong>Total:</strong> $${(orderData.total / 100).toFixed(2)}</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">
              We'll send you another email when your order ships.
            </p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export async function sendContactFormEmail(data: any) {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "Hunar <noreply@hunar.com>",
      to: process.env.CONTACT_EMAIL || "contact@hunar.com",
      subject: `Contact Form Submission from ${data.name}`,
      html: `
        <div style="font-family: sans-serif;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Message:</strong></p>
          <p>${data.message}</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending contact email:", error);
  }
}
