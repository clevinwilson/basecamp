import Mailgen from "mailgen";
import nodemailer from "nodemailer";

/**
 * Generates Mailgen email body content for email verification.
 * @param {string} username - The recipient's username.
 * @param {string} verificationUrl - The email verification link.
 * @returns {object} Mailgen email content object.
 */
const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to Basecamp! We're excited to have you on board.",
      instruction: "To verify your email address, please click the button below. This link will expire in 20 minutes.",
      action: {
        instructions: "To get started, please verify your email address by clicking the button below:",
        button: {
          color: "#22BC66",
          text: "Verify your email",
          link: verificationUrl,
        },
      },
      outro:
        "If you did not create an account, no further action is required. If you need help, feel free to reach out to our support team.",
    },
  };
};

/**
 * Generates Mailgen email body content for forgot password / password reset.
 * @param {string} username - The recipient's username.
 * @param {string} passwordResetUrl - The password reset link.
 * @returns {object} Mailgen email content object.
 */
const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "We received a request to reset your Basecamp account password.",
      instruction:
        "This password reset link will expire in 20 minutes. If you did not request a password reset, please ignore this email.",
      action: {
        instructions:
          "To reset your password, click the button below:",
        button: {
          color: "#FF6240",
          text: "Reset your password",
          link: passwordResetUrl,
        },
      },
      outro:
        "If you did not request a password reset, no further action is required. Your password will remain unchanged.",
    },
  };
};

/**
 * Sends an email using nodemailer and Mailgen.
 * @param {{ email: string, subject: string, mailgenContent: object }} options
 */
const sendMail = async (options) => {
  // Configure Mailgen with a theme and brand info
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Basecamp",
      link: process.env.CLIENT_URL || "http://localhost:8000",
    },
  });

  // Generate the HTML email body
  const emailHtml = mailGenerator.generate(options.mailgenContent);
  // Generate a plain-text fallback
  const emailText = mailGenerator.generatePlaintext(options.mailgenContent);

  // Create the nodemailer transporter using SMTP env vars
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"Basecamp" <${process.env.MAILTRAP_SMTP_USER}>`,
    to: options.email,
    subject: options.subject,
    text: emailText,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Mail sending failed:", error.message);
    // We don't throw here so a mail failure doesn't crash the whole request
  }
};



export { emailVerificationMailgenContent, forgotPasswordMailgenContent, sendMail };