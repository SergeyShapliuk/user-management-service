import { Router } from 'express';
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { UserSortField } from '../dtos/input/user-sort-field';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation-middleware';
import { updateUserStatusValidation } from '../validations/user.input-dto.validation-middlewares';

import { UserController } from '../controllers/user.controller';
import { UsersRepository } from '../repositories/users.repository';
import { UserService } from '../services/user.service';
import { UsersQwRepository } from '../repositories/users.query.repository';
import { accessTokenGuard } from '../../auth/guards/access.token.guard';

export const usersRouter = Router({});

const usersRepo = new UsersRepository();
const usersQwRepo = new UsersQwRepository();
const usersService = new UserService(usersRepo);
const usersController = new UserController(usersService, usersQwRepo);

usersRouter.use(accessTokenGuard);

usersRouter
  .get(
    '',
    ...paginationAndSortingValidation(UserSortField),
    inputValidationResultMiddleware,
    usersController.getUserListHandler.bind(usersController),
  )

  .get(
    '/:id',
    idValidation,
    inputValidationResultMiddleware,
    usersController.getUserByIdHandler.bind(usersController),
  )

  .patch(
    '/:id/status',
    ...updateUserStatusValidation,
    inputValidationResultMiddleware,
    usersController.statusUserHandler.bind(usersController),
  );
