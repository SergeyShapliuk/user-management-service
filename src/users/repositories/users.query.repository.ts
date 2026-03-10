import { UserQueryInput } from '../dtos/input/user-query.input';
import { ObjectId, WithId } from 'mongodb';
import { UserDocument, UserModel } from '../models/user.model';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';

export class UsersQwRepository {
  async findMany(
    queryDto: UserQueryInput,
  ): Promise<{ items: WithId<UserDocument>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchEmailTerm } =
      queryDto;

    const skip = (pageNumber - 1) * pageSize;

    const orConditions: any[] = [];

    if (searchEmailTerm && searchEmailTerm.trim() !== '') {
      orConditions.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
    }

    const filter = orConditions.length > 0 ? { $or: orConditions } : {};

    const sortDirectionNumber = sortDirection === 'asc' ? 1 : -1;

    const items = await UserModel.find(filter)
      .sort({ [sortBy]: sortDirectionNumber })
      .skip(skip)
      .limit(pageSize)
      .exec();

    const totalCount = await UserModel.countDocuments(filter);

    return { items, totalCount };
  }

  async findById(id: string): Promise<WithId<UserDocument> | null> {
    return UserModel.findOne({ _id: new ObjectId(id) });
  }

  async findByIdOrFail(id: string): Promise<WithId<UserDocument>> {
    console.log({ id });
    const res = await this.findById(id);

    if (!res) {
      throw new RepositoryNotFoundError('User not exist');
    }
    return res;
  }
}
