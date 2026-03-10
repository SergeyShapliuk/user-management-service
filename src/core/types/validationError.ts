import { HttpStatus } from './http-ststuses';

export type ValidationErrorType = {
  status: HttpStatus;
  detail: string;
  source?: string;
  code?: string;
};
