import { sendEmail } from "./sendEmail.js";

const wrap = (title, body) => `
  <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
    <h2 style="color:#02B290">${title}</h2>
    ${body}
    <p style="color:#666;font-size:12px;margin-top:24px">Bazaarly Grocery Shop</p>
  </div>
`;

export const sendOrderConfirmationEmail = async (user, order) => {
  const items = order.items
    .map((i) => `<li>${i.quantity}x — $${i.price * i.quantity}</li>`)
    .join("");
  const html = wrap(
    "Order Confirmed",
    `<p>Hi ${user.name},</p>
    <p>Your order #${order._id.toString().slice(-8)} has been placed successfully.</p>
    <p><strong>Payment:</strong> ${order.paymentMethod}</p>
    <p><strong>Total:</strong> $${order.totalAmount}</p>
    <ul>${items}</ul>
  `
  );
  await sendEmail(user.email, "Your Bazaarly Order Confirmation", html);
};

export const sendPaymentApprovedEmail = async (user, order) => {
  const html = wrap(
    "Payment Verified",
    `<p>Hi ${user.name},</p>
    <p>Your Easypaisa payment for order #${order._id.toString().slice(-8)} has been verified.</p>
    <p>Your order is now being processed and will be shipped soon.</p>
  `
  );
  await sendEmail(user.email, "Payment Verified — Bazaarly", html);
};

export const sendPaymentRejectedEmail = async (user, order) => {
  const html = wrap(
    "Payment Rejected",
    `<p>Hi ${user.name},</p>
    <p>Your Easypaisa payment for order #${order._id.toString().slice(-8)} could not be verified.</p>
    <p>Your order has been cancelled. Please contact support if you believe this is an error.</p>
  `
  );
  await sendEmail(user.email, "Payment Rejected — Bazaarly", html);
};

export const sendCodDeliveredEmail = async (user, order) => {
  const html = wrap(
    "Order Delivered",
    `<p>Hi ${user.name},</p>
    <p>Your COD order #${order._id.toString().slice(-8)} has been marked as delivered and paid.</p>
    <p>Thank you for shopping with Bazaarly!</p>
  `
  );
  await sendEmail(user.email, "Order Delivered — Bazaarly", html);
};
