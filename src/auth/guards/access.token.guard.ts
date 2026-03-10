import { NextFunction, Request, Response } from 'express';
import { jwtService } from '../../core/adapters/jwt.service';
import { PayloadType } from '../../core/types/id';

export const accessTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.headers.authorization) return res.sendStatus(401);

  const [authType, token] = req.headers.authorization.split(' ');

  if (authType !== 'Bearer') return res.sendStatus(401);

  const payload = await jwtService.verifyToken(token);

  if (payload) {
    const { userId, role } = payload;

    req.user = {
      id: userId,
      role: role,
    } as PayloadType;

    next();

    return;
  }
  res.sendStatus(401);

  return;
};
