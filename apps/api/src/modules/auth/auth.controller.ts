import { Body, Controller, Get, HttpCode, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import type { LoginRequest } from './auth.types';

const SESSION_COOKIE = 'inkflow_session';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginRequest, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { token, expiresAt, user } = await this.authService.login(body.email, body.password, req.headers['user-agent']);

    res.cookie(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      expires: expiresAt,
      path: '/',
    });

    return { user };
  }

  @Post('logout')
  @HttpCode(204)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.[SESSION_COOKIE];
    await this.authService.logout(token);
    res.clearCookie(SESSION_COOKIE, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
  }

  @Get('me')
  async me(@Req() req: Request) {
    const token = req.cookies?.[SESSION_COOKIE];
    const result = await this.authService.getAuthenticatedUser(token);
    if (!result) {
      throw new UnauthorizedException('Authentication required');
    }

    return { user: result.user };
  }
}
