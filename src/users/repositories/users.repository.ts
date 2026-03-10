import { UserDocument, UserModel } from '../models/user.model';

export class UsersRepository {
  async create(newUser: UserDocument): Promise<string> {
    const insertResult = await UserModel.insertOne(newUser);
    return insertResult._id.toString();
  }

  async updateUserStatus(userId: string, isActive: boolean): Promise<boolean> {
    const result = await UserModel.updateOne(
      { _id: userId },
      { $set: { isActive } },
    );
    return result.matchedCount === 1;
  }

  async doesExistByEmail(email: string): Promise<UserDocument | null> {
    return UserModel.findOne({ email });
  }
}
