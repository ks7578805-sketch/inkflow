export const USER_ROLES = ['OWNER', 'ADMIN', 'MANAGER', 'ARTIST', 'ASSISTANT'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const USER_STATUSES = ['ACTIVE', 'INVITED', 'DISABLED'] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

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

export type LoginResponse = {
  user: AuthUser;
};

export type MeResponse = {
  user: AuthUser;
};
