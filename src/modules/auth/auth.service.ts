import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  validateUser(username: string, password: string) {
    if (username === 'admin' && password === 'password') {
      return {
        success: true,
        message: 'Login successful',
      };
    }

    return {
      success: false,
      message: 'Invalid credentials',
    };
  }
}
