import { HttpStatus } from './http-ststuses';

type ValidationErrorOutput = {
  status: HttpStatus;
  detail: string;
  source: { pointer: string };
  code: string | null;
};

export type ValidationErrorListOutput = { errors: ValidationErrorOutput[] };

// type ValidationErrorOutput = {
//     message: string;
//     field: string;
// };
//
// export type ValidationErrorListOutput = { errorsMessages: ValidationErrorOutput[] };
