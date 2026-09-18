import { Resend } from "resend";
import "dotenv/config";

const resend = new Resend(process.env.RESEND_API_KEY);

class EmailService {
  async sendEmail(email: string, code: string) {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Validate account",
      html: `<p>Here's the code for register your account: <strong>${code}</strong> </p>`,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}

export const emailService = new EmailService();
