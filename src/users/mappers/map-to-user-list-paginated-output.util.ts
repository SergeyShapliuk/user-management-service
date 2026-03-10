import { UserListPaginatedOutput } from '../dtos/output/user-list-paginated.output';
import { UserDocument } from '../models/user.model';

export function mapToUserListPaginatedOutput(
  users: UserDocument[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): UserListPaginatedOutput {
  return {
    page: Number(meta.pageNumber),
    pageSize: Number(meta.pageSize),
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    totalCount: meta.totalCount,
    items: users.map((user) => ({
      id: user._id.toString(),
      fullName: user.fullName,
      birthDate: user.birthDate,
      role: user.role,
      isActive: user.isActive,
      email: user.email,
      createdAt: user.createdAt,
    })),
  };
}
