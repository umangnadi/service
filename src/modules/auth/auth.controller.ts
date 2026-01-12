import { Body, Controller, Post, Version } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Version('1')
  login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.validateAdmin(username, password);
  }
}
