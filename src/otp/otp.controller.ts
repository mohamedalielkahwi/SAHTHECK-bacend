import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { OtpService } from './otp.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('/send')
  async sendOtp(@Request() req, @Body() body: { type: string }) {
    return this.otpService.sendOtp(
      req.user.userId,
      req.user.email,
      body.type,
    );
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('/verify')
  async verifyOtp(@Request() req, @Body() body: { code: string; type: string }) {
    return this.otpService.verifyOtp(req.user.userId, body.code, body.type);
  }
}