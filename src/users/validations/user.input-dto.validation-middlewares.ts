import { body } from 'express-validator';

export const statusValidation = body('isActive')
  .exists()
  .withMessage('isActive is required')
  .isBoolean()
  .withMessage('isActive must be boolean');

export const updateUserStatusValidation = [statusValidation];
