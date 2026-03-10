import request from 'supertest';
import { setupApp } from '../src/setup-app';
import express from 'express';
import mongoose from 'mongoose';
import { SETTINGS } from '../src/core/settings/settings';
import { randomUUID } from 'crypto';
import { UserModel } from '../src/users/models/user.model';

describe('Mongoose integration', () => {
  let app: any;

  beforeAll(async () => {
    await mongoose.connect(SETTINGS.MONGO_URL);
    app = express();
    setupApp(app);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Users e2e', () => {
    let userToken: string;
    let adminToken: string;
    let userId: string;
    let otherId: string;

    beforeAll(async () => {
      await UserModel.deleteMany({ role: { $ne: 'admin' } });
      // await createAdminIfNotExists();
    });

    test('register user', async () => {
      const res = await request.agent(app).post('/api/auth/registration').send({
        fullName: 'Ivan Ivanov',
        birthDate: '2000-01-01',
        email: 'ivan@test.com',
        password: '123456',
      });

      expect(res.status).toBe(201); // 201 Created, не 200
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('email');
      expect(res.body.email).toBe('ivan@test.com');
      expect(res.body).not.toHaveProperty('passwordHash'); // не должно быть пароля

      userId = res.body.id;
    });

    test('register user - duplicate email', async () => {
      const forOtherId = await request
        .agent(app)
        .post('/api/auth/registration')
        .send({
          fullName: 'Petr Petrov',
          birthDate: '1995-05-05',
          email: 'petr@test.com',
          password: '123456',
        });

      otherId = forOtherId.body.id;

      const res = await request.agent(app).post('/api/auth/registration').send({
        fullName: 'Petr Petrov',
        birthDate: '1995-05-05',
        email: 'petr@test.com',
        password: '123456',
      });

      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('errors');
    });

    test('login user success', async () => {
      const email = `ivan@test.com`;

      const res = await request.agent(app).post('/api/auth/login').send({
        email,
        password: '123456',
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');

      userToken = res.body.accessToken;
    });

    test('login user - wrong email', async () => {
      const wrongEmail = `wrong${Date.now()}test.com`;
      const res = await request.agent(app).post('/api/auth/login').send({
        email: wrongEmail,
        password: '123456',
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });

    test('user get self', async () => {
      const res = await request
        .agent(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        id: userId,
        fullName: 'Ivan Ivanov',
        birthDate: '2000-01-01',
        email: 'ivan@test.com',
        role: 'user',
        isActive: true,
        createdAt: expect.any(String),
      });
    });

    test('user cannot get other user', async () => {
      const res = await request
        .agent(app)
        .get(`/api/users/${otherId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });

    test('login admin success', async () => {
      const admin = {
        id: randomUUID(),
        fullName: 'Admin',
        birthDate: '1990-01-01',
        email: 'admin@mail.com',
        password: 'admin123',
        role: 'admin',
        isActive: true,
      };

      const res = await request.agent(app).post('/api/auth/login').send({
        email: admin.email,
        password: admin.password,
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');

      adminToken = res.body.accessToken;
    });

    test('admin get users list', async () => {
      const res = await request
        .agent(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
    });

    test('admin get user by id', async () => {
      const res = await request
        .agent(app)
        .get(`/api/users/${otherId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
    });

    test('user cannot get users list', async () => {
      const res = await request
        .agent(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });

    test('user change status', async () => {
      console.log('userId1', userId);
      console.log('userToken1', userToken);
      const res = await request
        .agent(app)
        .patch(`/api/users/${userId}/status`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          isActive: false,
        });
      expect(res.statusCode).toBe(204);
    });
  });
});
