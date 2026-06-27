import { ILoan } from '../entities/Loan';
import { ILoanRepository } from '../repositories/ILoanRepository';
import { IBookRepository } from '../repositories/IBookRepository';
import { IUserRepository } from '../repositories/IUserRepository';
import { LoanNotFoundError } from '../errors/LoanNotFoundError';

interface ReturnInput {
  loanId: string;
}

export class ReturnUseCase {
  constructor(
    private readonly loanRepository: ILoanRepository,
    private readonly bookRepository: IBookRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute({ loanId }: ReturnInput): Promise<ILoan> {
    const loan = await this.loanRepository.findById(loanId);

    if (!loan) {
      throw new LoanNotFoundError();
    }

    const now = new Date();
    const elapsedDays = Math.floor(
      (now.getTime() - loan.borrowedAt.getTime()) / (1000 * 60 * 60 * 24),
    );
    const daysLate = Math.max(0, elapsedDays - 7);
    const penaltyFee = daysLate * 2.0;

    const updatedLoan = await this.loanRepository.update(loanId, {
      returnedAt: now,
      penaltyFee,
    });

    await this.bookRepository.setAvailability(loan.bookId, true);
    await this.userRepository.decrementActiveLoans(loan.userId);

    return updatedLoan;
  }
}
