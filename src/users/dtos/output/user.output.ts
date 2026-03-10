import { UserRole } from '../../types/user.types';

export type UserViewModel = {
  id: string;
  fullName: string;
  birthDate: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
};
