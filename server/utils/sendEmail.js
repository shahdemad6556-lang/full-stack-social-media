import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("Email skipped: EMAIL_USER / EMAIL_PASS not set");
    return;
  }
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({
      from: `"Social" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("Email error:", err.message);
  }
};