export class BookNotAvailableError extends Error {
  name = "BookNotAvailableError" as const;

  constructor(message = "Book is not available for loan.") {
    super(message);
    Object.setPrototypeOf(this, BookNotAvailableError.prototype);
  }
}
