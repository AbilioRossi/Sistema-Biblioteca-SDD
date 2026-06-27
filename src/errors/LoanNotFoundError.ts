export class LoanNotFoundError extends Error {
  name = "LoanNotFoundError" as const;

  constructor(message = "Loan not found.") {
    super(message);
    Object.setPrototypeOf(this, LoanNotFoundError.prototype);
  }
}
