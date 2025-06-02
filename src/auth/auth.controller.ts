import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './public.const';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }
}
