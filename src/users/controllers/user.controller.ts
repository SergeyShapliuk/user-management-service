import { UserService } from '../services/user.service';
import { Response } from 'express';
import { UserQueryInput } from '../dtos/input/user-query.input';
import { matchedData } from 'express-validator';
import { setDefaultSortAndPaginationIfNotExist } from '../../core/helpers/set-default-sort-and-pagination';
import { mapToUserListPaginatedOutput } from '../mappers/map-to-user-list-paginated-output.util';
import { HttpStatus } from '../../core/types/http-ststuses';
import { errorsHandler } from '../../core/errors/errors.handler';
import { mapToUserOutputUtil } from '../mappers/map-to-user-output.util';
import { UsersQwRepository } from '../repositories/users.query.repository';
import {
  RequestWithParamsAndBodyAndUser,
  RequestWithParamsAndUser,
} from '../../core/types/requests';
import { UpdateUserStatusDto } from '../dtos/input/user-status-update.input';
import { PayloadType } from '../../core/types/id';

export class UserController {
  constructor(
    private userService: UserService,
    private usersQwRepository: UsersQwRepository,
  ) {}

  async getUserListHandler(
    req: RequestWithParamsAndUser<UserQueryInput, PayloadType>,
    res: Response,
  ) {
    try {
      if (!req.user) {
        return res.sendStatus(HttpStatus.Unauthorized);
      }

      const { role } = req.user;

      if (role === 'user') return res.sendStatus(HttpStatus.Forbidden);

      const sanitizedQuery = matchedData<UserQueryInput>(req, {
        locations: ['query'],
        includeOptionals: true,
      });

      const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

      const { items, totalCount } =
        await this.usersQwRepository.findMany(queryInput);
      const postListOutput = mapToUserListPaginatedOutput(items, {
        pageNumber: queryInput.pageNumber,
        pageSize: queryInput.pageSize,
        totalCount,
      });

      res.status(HttpStatus.Ok).send(postListOutput);
    } catch (e) {
      errorsHandler(e, res);
    }
  }

  async getUserByIdHandler(
    req: RequestWithParamsAndUser<{ id: string }, PayloadType>,
    res: Response,
  ) {
    try {
      const findUserId = req.params.id;

      if (!req.user) return res.sendStatus(HttpStatus.Unauthorized);

      const { id, role } = req.user;

      if (role === 'user' && id !== findUserId)
        return res.sendStatus(HttpStatus.Forbidden);

      const me = await this.usersQwRepository.findByIdOrFail(findUserId);

      return res.status(HttpStatus.Ok).send(mapToUserOutputUtil(me));
    } catch (e) {
      errorsHandler(e, res);
    }
  }

  async statusUserHandler(
    req: RequestWithParamsAndBodyAndUser<
      { id: string },
      UpdateUserStatusDto,
      PayloadType
    >,
    res: Response,
  ) {
    try {
      const userId = req.params.id;
      const currentUserId = req.user?.id ?? userId;
      const currentUserRole = req.user?.role ?? 'user';
      const { isActive } = req.body;

      if (!userId || !currentUserId)
        return res.sendStatus(HttpStatus.Unauthorized);

      const result = await this.userService.updateUserStatus(
        userId,
        currentUserId,
        currentUserRole,
        isActive,
      );
      if (!result) {
        return res.sendStatus(403);
      }

      return res.sendStatus(HttpStatus.NoContent);
    } catch (e) {
      errorsHandler(e, res);
    }
  }
}
