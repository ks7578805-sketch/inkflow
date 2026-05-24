import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';

const SESSION_COOKIE = 'inkflow_session';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request & { authUser?: NonNullable<Awaited<ReturnType<AuthService['getAuthenticatedUser']>>>['user'] }>();
    const token = request.cookies?.[SESSION_COOKIE];
    const result = await this.authService.getAuthenticatedUser(token);

    if (!result) {
      throw new UnauthorizedException('Authentication required');
    }

    request.authUser = result.user;
    return true;
  }
}
