import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
console.log("SMTP_EMAIL:", process.env.SMTP_EMAIL);
console.log("SMTP_PASSWORD:", process.env.SMTP_PASSWORD ? "Loaded ✅" : "Missing ❌");
const transporter = nodemailer.createTransport({
  service:"gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP error:", error);
  } else {
    console.log("SMTP connection ready ✅");
  }
});


export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"Grocery Shop" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw new Error("Email could not be sent");
  }
};