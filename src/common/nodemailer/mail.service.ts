// mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendOtp(email: string, otp: string) {
    await this.transporter.sendMail({
      from: '"Nadi Astrology" <noreply@nadiastrology.com>',
      to: email,
      subject: 'Your OTP Code',
      html: `
        <h2 style="color: #4F46E5;">Your OTP: <strong>${otp}</strong></h2>
        <p>This code expires in 10 minutes.</p>
      `,
    });
  }
}
