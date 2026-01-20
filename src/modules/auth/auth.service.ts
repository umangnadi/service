// auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { MailService } from '../../common/nodemailer/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService, //  Added for OTP
  ) {}

  //  YOUR EXISTING ADMIN LOGIN (UNCHANGED)
  async validateAdmin(email: string, password: string) {
    const admin = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!admin || admin.role !== 'admin' || !admin.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: admin.id,
      role: admin.role,
      email: admin.email,
    };

    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: '15m',
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: '7d',
      }),
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    };
  }

  //  NEW: user CHECKOUT - Send OTP
  async sendOtp(email: string) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({ 
      where: { email } 
    });

    if (existingUser) {
      throw new BadRequestException('User already exists. Please login with password.');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save OTP (10 min expiry)
    await this.prisma.otp.create({
      data: {
        email,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    // Send email OTP
    await this.mailService.sendOtp(email, otp);
    
    return { message: 'OTP sent to your email' };
  }

  //  NEW: user CHECKOUT - Verify OTP & Create User
  async verifyOtp(email: string, otp: string) {
    // Verify OTP
    const otpRecord = await this.prisma.otp.findFirst({
      where: {
        email,
        otp,
        expiresAt: { gt: new Date() },
      },
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Create new user (role: user, no password)
    const user = await this.prisma.user.create({
      data: {
        email,
        role: 'user', //  user user (not admin)
      },
    });

    // Cleanup OTP
    await this.prisma.otp.delete({ where: { id: otpRecord.id } });

    // Generate tokens (SAME format as admin)
    const payload = {
      sub: user.id,
      role: user.role,
      email: user.email,
    };

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: { //  Return user instead of admin
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
