import { createTransport } from "nodemailer";

const transporter = createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  secure: false,
  auth: {
    user: "1be538d4333169",
    pass: "d1bb6a40534a1d",
  },
});

export const sendEmailResetPassword = async (
  email: string,
  resetToken: string,
) => {
  const resetLink = `http://localhost:3000/api/v1/auth/reset-password/${resetToken}`;
  const dateRequested = new Date().toUTCString();

  try {
    await transporter.sendMail({
      from: "depermana <depermana@email.com>",
      to: email,
      subject: "Reset Password Instructions",
      html: `
      <h1>Password Reset</h1>
      <p>You requested a password reset at ${dateRequested}</p>
      <p>Please do not share this link to anybody</p>
      </br>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      </br>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
    });
    console.log("email sent");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    String(error);
  }
};

export default sendEmailResetPassword;
