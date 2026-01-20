// auth.controller.ts
import { Body, Controller, Post, Version, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'nestjs-zod';
import {  LoginDtoSchema } from './dto/auth.dto';
import  type {LoginDto, OtpDto, VerifyOtpDto} from './dto/auth.dto'
import { OtpDtoSchema, VerifyOtpDtoSchema } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //  YOUR EXISTING ADMIN LOGIN (UNCHANGED)
  @Post('login')
  @Version('1')
  @UsePipes(new ZodValidationPipe(LoginDtoSchema))
  login(@Body() loginDto: LoginDto) {  // ← Full DTO object
    return this.authService.validateAdmin(loginDto.email, loginDto.password);
  }
  //  NEW: user CHECKOUT - Send OTP
   @Post('send-otp')
  @UsePipes(new ZodValidationPipe(OtpDtoSchema))
  async sendOtp(@Body() otpDto: OtpDto) {  // ← Full object
    return this.authService.sendOtp(otpDto.email);
  }

  // ✅ FIXED: Use full DTO object  
  @Post('verify-otp')
  @UsePipes(new ZodValidationPipe(VerifyOtpDtoSchema))
  async verifyOtp(@Body() verifyDto: VerifyOtpDto) {  // ← Full object
    return this.authService.verifyOtp(verifyDto.email, verifyDto.otp);
  }
}

