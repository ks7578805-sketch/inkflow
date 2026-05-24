import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomBytes, createHash } from 'node:crypto';
import * as argon2 from 'argon2';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { toAuthUser } from './auth.types';

const SESSION_TTL_DAYS = 30;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async login(email: string, password: string, userAgent?: string) {
    const user = await this.usersService.findByEmail(email.toLowerCase().trim());
    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Invalid email or password');
    }

    const validPassword = await argon2.verify(user.passwordHash, password);
    if (!validPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const rawToken = randomBytes(48).toString('hex');
    const sessionTokenHash = createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

    await this.prisma.authSession.create({
      data: {
        userId: user.id,
        sessionTokenHash,
        userAgent,
        expiresAt,
      },
    });

    const updatedUser = await this.usersService.updateLastLogin(user.id);

    return {
      token: rawToken,
      expiresAt,
      user: toAuthUser(updatedUser),
    };
  }

  async getAuthenticatedUser(rawToken?: string) {
    if (!rawToken) {
      return null;
    }

    const sessionTokenHash = createHash('sha256').update(rawToken).digest('hex');
    const session = await this.prisma.authSession.findUnique({
      where: { sessionTokenHash },
      include: {
        user: {
          include: {
            artist: true,
          },
        },
      },
    });

    if (!session || session.revokedAt || session.expiresAt <= new Date()) {
      return null;
    }

    if (session.user.status !== 'ACTIVE') {
      return null;
    }

    return {
      sessionId: session.id,
      user: toAuthUser(session.user),
    };
  }

  async logout(rawToken?: string) {
    if (!rawToken) {
      return;
    }

    const sessionTokenHash = createHash('sha256').update(rawToken).digest('hex');
    await this.prisma.authSession.updateMany({
      where: {
        sessionTokenHash,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
}
