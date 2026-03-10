import { Request, Response, Router } from 'express';
import { HttpStatus } from '../../core/types/http-ststuses';
import { UserModel } from '../../users/models/user.model';

export const testingRouter = Router({});

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
  await Promise.all([UserModel.deleteMany({ role: { $ne: 'admin' } })]);
  res.sendStatus(HttpStatus.NoContent);
});
