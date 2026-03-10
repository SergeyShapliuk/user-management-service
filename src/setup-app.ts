import express, { Express } from 'express';
import { HttpStatus } from './core/types/http-ststuses';
import { setupSwagger } from './core/swagger/setup-swagger';
import {
  API_PREFIX,
  AUTH_PATH,
  TESTING_PATH,
  USERS_PATH,
} from './core/paths/paths';

import { testingRouter } from './testing/routers/testing.router';
import { usersRouter } from './users/routers/users.router';
import { authRouter } from './auth/routers/auth.router';
import cors from 'cors';

export const setupApp = (app: Express) => {

  app.use(cors());
  app.use(express.json());

  setupSwagger(app);

  app.use(`${API_PREFIX}${USERS_PATH}`, usersRouter);
  app.use(`${API_PREFIX}${AUTH_PATH}`, authRouter);
  app.use(TESTING_PATH, testingRouter);

  app.get('/', (req, res) => {
    res.status(HttpStatus.Ok).send('Test Effective Mobile');
  });


  return app;
};
