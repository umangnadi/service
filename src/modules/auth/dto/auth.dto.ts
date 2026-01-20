// dto/auth.dto.ts
import { z } from 'zod';

export const LoginDtoSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password too short'),
});

export type LoginDto = z.infer<typeof LoginDtoSchema>;

export const OtpDtoSchema = z.object({
  email: z.string().email('Invalid email'),
});

export type OtpDto = z.infer<typeof OtpDtoSchema>;

export const VerifyOtpDtoSchema = z.object({
  email: z.string().email('Invalid email'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export type VerifyOtpDto = z.infer<typeof VerifyOtpDtoSchema>;
