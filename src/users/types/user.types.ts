export const USER_ROLE = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export const USER_ROLE_VALUES = Object.values(USER_ROLE);

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export type User = {
  fullName: string;
  birthDate: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
};
