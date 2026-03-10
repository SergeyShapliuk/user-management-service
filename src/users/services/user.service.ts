import { UsersRepository } from '../repositories/users.repository';
import { UserRole } from '../types/user.types';

export class UserService {
  constructor(private usersRepository: UsersRepository) {}

  async updateUserStatus(
    targetUserId: string,
    currentUserId: string,
    currentUserRole: UserRole,
    isActive: boolean,
  ): Promise<boolean> {
    if (currentUserRole !== 'admin' && currentUserId !== targetUserId) {
      return false;
    }

    return await this.usersRepository.updateUserStatus(targetUserId, isActive);
  }
}
