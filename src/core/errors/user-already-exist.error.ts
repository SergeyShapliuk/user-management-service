export class UserAlreadyExistError extends Error {
  constructor(
    email: string,
    public readonly code: string,
    public readonly source?: string,
  ) {
    super(email);
  }
}
