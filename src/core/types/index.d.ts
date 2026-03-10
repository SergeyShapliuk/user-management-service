import { PayloadType } from './id';

declare global {
  namespace Express {
    export interface Request {
      user: PayloadType | undefined;
    }
  }
}

export {};
