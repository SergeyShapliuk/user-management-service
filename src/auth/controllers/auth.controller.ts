import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-ststuses';
import { errorsHandler } from '../../core/errors/errors.handler';
import { AuthService } from '../services/auth.service';
import { LoginUserDto } from '../dtos/login-user-dto';
import { UserCreateInput } from '../../users/dtos/input/user-create.input';
import { mapToUserOutputUtil } from '../../users/mappers/map-to-user-output.util';

export class AuthController {
  constructor(private authService: AuthService) {}

  async loginUserHandler(req: Request<{}, {}, LoginUserDto>, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.loginUser({ email, password });

      if (!result || !result?.accessToken)
        return res.sendStatus(HttpStatus.Unauthorized);

      const { accessToken } = result;

      res.status(HttpStatus.Ok).send({ accessToken });
    } catch (e) {
      errorsHandler(e, res);
    }
  }

  async registrationUserHandler(
    req: Request<{}, {}, UserCreateInput>,
    res: Response,
  ) {
    try {
      const result = await this.authService.registerUser(req.body);
      const userOutput = mapToUserOutputUtil(result);
      return res.status(HttpStatus.Created).send(userOutput);
    } catch (e) {
      errorsHandler(e, res);
    }
  }
}
