import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendOtp(email: string, code: string, type: string) {
    const subjects = {
      EMAIL_VERIFICATION: 'Verify your SAHTECK email',
      PHONE_VERIFICATION: 'Verify your phone number',
      TWO_FACTOR: 'Your SAHTECK login code',
    };

    await this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: subjects[type] || 'Your SAHTECK OTP code',
      html: `
        <h2>Your verification code</h2>
        <p>Use this code to complete your verification:</p>
        <h1 style="letter-spacing: 8px">${code}</h1>
        <p>This code expires in 5 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });
  }
}