import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';

import {
  loginInputValidation,
  registrationInputValidation,
} from '../validations/auth.input-dto.validation-middlewares';
import { UsersRepository } from '../../users/repositories/users.repository';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';

export const authRouter = Router({});

const usersRepo = new UsersRepository();
const authService = new AuthService(usersRepo);
const authController = new AuthController(authService);

authRouter

  .post(
    '/login',
    loginInputValidation,
    inputValidationResultMiddleware,
    authController.loginUserHandler.bind(authController),
  )

  .post(
    '/registration',
    registrationInputValidation,
    inputValidationResultMiddleware,
    authController.registrationUserHandler.bind(authController),
  );
