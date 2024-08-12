import nodemailer from "nodemailer";

export const sendConfirmationEmail = async (email: string, name: string) => {
  try {
    console.log("creating the ", {
      auth: {
        user: process.env.SES_SMTP_USERNAME || "YOUR_SES_SMTP_USERNAME",
        pass: process.env.SES_SMTP_PASSWORD || "YOUR_SES_SMTP_PASSWORD",
      },
    });
    const transporter = nodemailer.createTransport({
      host: "email-smtp.us-east-1.amazonaws.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SES_SMTP_USERNAME || "YOUR_SES_SMTP_USERNAME",
        pass: process.env.SES_SMTP_PASSWORD || "YOUR_SES_SMTP_PASSWORD",
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Confirmation Email",
      text: `Hello ${name},\n\nThank you for joining us!\n\nBest regards,\nYour Company Name`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent to:", email);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
