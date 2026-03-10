import { UserDocument } from '../models/user.model';
import { UserViewModel } from '../dtos/output/user.output';

export function mapToUserOutputUtil(user: UserDocument): UserViewModel {
  return {
    id: user._id.toString(),
    fullName: user.fullName,
    birthDate: user.birthDate,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
}
