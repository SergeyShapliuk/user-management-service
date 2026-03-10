import mongoose, { HydratedDocument, Model, model } from 'mongoose';
import { User, USER_ROLE, USER_ROLE_VALUES } from '../types/user.types';
import { USERS_COLLECTION_NAME } from '../../db/db';

export type UserDocument = HydratedDocument<User>;

type UserModelType = Model<User>;

const userSchema = new mongoose.Schema<User>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    birthDate: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: USER_ROLE_VALUES,
      default: USER_ROLE.USER,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: String,
      default: () => new Date().toISOString(),
    },
  },
  {
    versionKey: false,
  },
);

export const UserModel = model<User, UserModelType>(
  USERS_COLLECTION_NAME,
  userSchema,
);
