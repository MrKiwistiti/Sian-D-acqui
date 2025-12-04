import { Body, Controller, Post, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.auth.login(body.email, body.password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('change-password')
  async changePassword(
    @Req() req: any,
    @Body() body: { newPassword: string }
  ) {
    if (!body?.newPassword || body.newPassword.trim().length < 6) {
      throw new BadRequestException('Password must be at least 6 chars.');
    }
    const userId = req.user?.sub;
    return this.auth.changePassword(userId, body.newPassword);
  }
}
