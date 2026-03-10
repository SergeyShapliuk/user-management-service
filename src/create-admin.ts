import bcrypt from 'bcrypt';
import { UserModel } from './users/models/user.model';

export const createAdminIfNotExists = async () => {
  const adminEmail = 'admin@mail.com';

  const passwordHash = await bcrypt.hash('admin123', 10);

  const result = await UserModel.updateOne(
    { email: adminEmail },
    {
      $setOnInsert: {
        fullName: 'Admin',
        birthDate: '1990-01-01',
        email: adminEmail,
        passwordHash,
        role: 'admin',
        isActive: true,
      },
    },
    { upsert: true },
  );

  if (result.upsertedCount) {
    console.log('Admin created');
  } else {
    console.log('Admin already exists');
  }
};
