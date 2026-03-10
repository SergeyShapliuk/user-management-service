import jwt, { SignOptions } from 'jsonwebtoken';
import { UserRole } from '../../users/types/user.types';

type AccessTokenPayload = {
  userId: string;
  role: UserRole;
};

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || 'createToken-for-me';
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '1h';

export const jwtService = {
  async createToken(userId: string, role: UserRole): Promise<string> {
    const options: SignOptions = {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN as SignOptions['expiresIn'],
    };
    return jwt.sign({ userId, role }, ACCESS_TOKEN_SECRET, options);
  },
  // async decodeToken(token: string): Promise<any> {
  //   try {
  //     return jwt.decode(token);
  //   } catch (e: unknown) {
  //     console.error("Can't decode token", e);
  //     return null;
  //   }
  // },
  async verifyToken(token: string): Promise<AccessTokenPayload | null> {
    try {
      return jwt.verify(token, ACCESS_TOKEN_SECRET) as AccessTokenPayload;
    } catch (error) {
      console.error('Token verify some error', error);
      return null;
    }
  },
};
