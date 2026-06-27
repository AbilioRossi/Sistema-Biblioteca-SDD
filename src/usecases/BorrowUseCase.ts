import { ILoan } from '../entities/Loan';
import { IBookRepository } from '../repositories/IBookRepository';
import { ILoanRepository } from '../repositories/ILoanRepository';
import { IUserRepository } from '../repositories/IUserRepository';
import { BookNotAvailableError } from '../errors/BookNotAvailableError';
import { LimitReachedError } from '../errors/LimitReachedError';

interface BorrowInput {
  userId: string;
  bookId: string;
}

export class BorrowUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly bookRepository: IBookRepository,
    private readonly loanRepository: ILoanRepository,
  ) {}

  async execute({ userId, bookId }: BorrowInput): Promise<ILoan> {
    const book = await this.bookRepository.findById(bookId);
    if (!book || !book.isAvailable) {
      throw new BookNotAvailableError();
    }

    const activeLoansCount = await this.loanRepository.countActiveByUser(userId);
    if (activeLoansCount >= 3) {
      throw new LimitReachedError();
    }

    const loan = await this.loanRepository.create({ userId, bookId });

    await this.bookRepository.setAvailability(bookId, false);
    await this.userRepository.incrementActiveLoans(userId);

    return loan;
  }
}
