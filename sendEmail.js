const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, template, data }) => {
  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const html = getTemplate(template, data);

  const mailOptions = {
    from: `"Namkeen Store" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

const getTemplate = (template, data) => {
  const base = (content) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #e67e22, #d35400); padding: 30px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
        .header p { color: rgba(255,255,255,0.9); margin: 5px 0 0; font-size: 14px; }
        .body { padding: 30px; }
        .footer { background: #333; padding: 20px; text-align: center; color: #999; font-size: 12px; }
        .btn { display: inline-block; padding: 14px 28px; background: #e67e22; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 15px 0; }
        .order-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .order-table th { background: #f8f8f8; padding: 10px; text-align: left; font-size: 13px; color: #666; }
        .order-table td { padding: 10px; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .badge-success { background: #e8f5e9; color: #2e7d32; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🍿 Namkeen Store</h1>
          <p>Premium Indian Snacks</p>
        </div>
        <div class="body">${content}</div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Namkeen Store. All rights reserved.</p>
          <p>If you have questions, contact us at support@namkeenstore.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  switch (template) {
    case 'welcome':
      return base(`
        <h2>Welcome to Namkeen Store, ${data.name}! 🎉</h2>
        <p>Thank you for joining us! We're excited to have you as part of our family.</p>
        <p>Explore our wide range of premium Indian namkeens and snacks:</p>
        <ul>
          <li>🌟 Fresh Bhujia & Sev</li>
          <li>🌟 Crispy Chips & Mixtures</li>
          <li>🌟 Healthy & Diet Snacks</li>
          <li>🌟 Traditional Indian Snacks</li>
        </ul>
        <a href="${process.env.FRONTEND_URL}/products" class="btn">Start Shopping</a>
        <p>Happy Snacking! 🙏</p>
      `);

    case 'orderConfirmation':
      return base(`
        <h2>Order Confirmed! ✅</h2>
        <p>Hi ${data.order.shippingAddress.name}, your order has been placed successfully!</p>
        <div style="background: #fff8f0; padding: 15px; border-radius: 8px; border-left: 4px solid #e67e22; margin: 15px 0;">
          <strong>Order Number:</strong> #${data.order.orderNumber}<br>
          <strong>Total:</strong> ₹${data.order.totalPrice.toFixed(2)}<br>
          <strong>Payment:</strong> ${data.order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}<br>
          <strong>Estimated Delivery:</strong> 3-5 business days
        </div>
        <table class="order-table">
          <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
          ${data.order.items.map(item => `<tr><td>${item.name}</td><td>${item.quantity}</td><td>₹${(item.price * item.quantity).toFixed(2)}</td></tr>`).join('')}
        </table>
        <a href="${process.env.FRONTEND_URL}/orders/${data.order._id}" class="btn">Track Order</a>
      `);

    case 'orderStatus':
      return base(`
        <h2>Order Update 📦</h2>
        <p>Hi ${data.user.name}, your order status has been updated.</p>
        <div style="background: #fff8f0; padding: 15px; border-radius: 8px; border-left: 4px solid #e67e22; margin: 15px 0;">
          <strong>Order:</strong> #${data.order.orderNumber}<br>
          <strong>Status:</strong> <span class="badge badge-success">${data.order.orderStatus.toUpperCase()}</span>
          ${data.order.trackingNumber ? `<br><strong>Tracking:</strong> ${data.order.trackingNumber}` : ''}
        </div>
        <a href="${process.env.FRONTEND_URL}/orders/${data.order._id}" class="btn">View Order</a>
      `);

    case 'resetPassword':
      return base(`
        <h2>Reset Your Password 🔐</h2>
        <p>Hi ${data.name}, we received a request to reset your password.</p>
        <p>Click the button below to reset it. This link will expire in 30 minutes.</p>
        <a href="${data.resetUrl}" class="btn">Reset Password</a>
        <p style="color: #999; font-size: 13px;">If you didn't request this, please ignore this email.</p>
      `);

    default:
      return base(`<p>${JSON.stringify(data)}</p>`);
  }
};

module.exports = sendEmail;
