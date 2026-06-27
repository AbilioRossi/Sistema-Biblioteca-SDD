export class LimitReachedError extends Error {
  name = "LimitReachedError" as const;

  constructor(message = "User has reached the maximum number of active loans.") {
    super(message);
    Object.setPrototypeOf(this, LimitReachedError.prototype);
  }
}
