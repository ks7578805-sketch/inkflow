import type { Artist, User, UserRole, UserStatus } from '@prisma/client';

export type AuthUser = {
  id: string;
  studioId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  artistId?: string | null;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export function toAuthUser(user: User & { artist: Artist | null }): AuthUser {
  return {
    id: user.id,
    studioId: user.studioId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    status: user.status,
    artistId: user.artist?.id ?? null,
  };
}
