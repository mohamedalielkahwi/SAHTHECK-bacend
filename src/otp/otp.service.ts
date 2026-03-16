import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class OtpService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  // generate a random 6 digit code
  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOtp(userId: string, email: string, type: string) {
    // invalidate any existing unused OTPs of same type
    await this.prisma.otp.updateMany({
      where: { userId, type: type as any, isUsed: false },
      data: { isUsed: true },
    });

    const code = this.generateCode();
    const expiresAt = new Date(
      Date.now() + Number(process.env.OTP_EXPIRES_IN || 300) * 1000,
    );

    await this.prisma.otp.create({
      data: { userId, code, type: type as any, expiresAt },
    });

    await this.mailService.sendOtp(email, code, type);
    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(userId: string, code: string, type: string) {
    const otp = await this.prisma.otp.findFirst({
      where: {
        userId,
        code,
        type: type as any,
        isUsed: false,
        expiresAt: { gt: new Date() }, // not expired
      },
    });

    if (!otp) throw new ConflictException('Invalid or expired OTP');

    // mark as used
    await this.prisma.otp.update({
      where: { id: otp.id },
      data: { isUsed: true },
    });

    // if email verification, mark user as verified
    if (type === 'EMAIL_VERIFICATION') {
      await this.prisma.user.update({
        where: { userId },
        data: { isEmailVerified: true },
      });
    }

    return { message: 'OTP verified successfully' };
  }
}