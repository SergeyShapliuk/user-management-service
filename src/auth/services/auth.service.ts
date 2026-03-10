import { bcryptService } from '../../core/adapters/bcrypt.service';
import { jwtService } from '../../core/adapters/jwt.service';

import { UsersRepository } from '../../users/repositories/users.repository';
import { LoginUserDto } from '../dtos/login-user-dto';
import { UserDocument, UserModel } from '../../users/models/user.model';
import { UserCreateInput } from '../../users/dtos/input/user-create.input';
import { UserRole } from '../../users/types/user.types';
import { UserAlreadyExistError } from '../../core/errors/user-already-exist.error';

export class AuthService {
  constructor(private usersRepository: UsersRepository) {}

  async loginUser(dto: LoginUserDto): Promise<{ accessToken: string } | null> {
    const user = await this.checkUserCredentials(dto);
    if (!user) {
      return null;
    }
    const accessToken = await jwtService.createToken(user.id, user.role);

    return { accessToken };
  }

  async registerUser(dto: UserCreateInput): Promise<UserDocument> {
    const { fullName, birthDate, email, password } = dto;
    const existenceCheck = await this.usersRepository.doesExistByEmail(email);
    if (!!existenceCheck) {
      throw new UserAlreadyExistError(
        dto.email,
        'USER_ALREADY_EXISTS',
        'email',
      );
    }
    const passwordHash = await bcryptService.generateHash(password);
    const newUser = new UserModel({ fullName, birthDate, email, passwordHash });

    await this.usersRepository.create(newUser);

    return newUser;
  }

  async checkUserCredentials(
    dto: LoginUserDto,
  ): Promise<{ id: string; role: UserRole } | null> {
    const user = await this.usersRepository.doesExistByEmail(dto.email);
    if (!user) return null;
    const isPassCorrect = await bcryptService.checkPassword(
      dto.password,
      user.passwordHash ?? '',
    );
    if (!isPassCorrect) {
      return null;
    }
    return { id: user._id.toString(), role: user.role };
  }
}
