import { Request, Response } from 'express';
import { PrismaUserRepository } from '../repositories/prisma/PrismaUserRepository';
import { PrismaBookRepository } from '../repositories/prisma/PrismaBookRepository';
import { PrismaLoanRepository } from '../repositories/prisma/PrismaLoanRepository';
import { BorrowUseCase } from '../usecases/BorrowUseCase';
import { ReturnUseCase } from '../usecases/ReturnUseCase';
import { BookNotAvailableError } from '../errors/BookNotAvailableError';
import { LimitReachedError } from '../errors/LimitReachedError';
import { LoanNotFoundError } from '../errors/LoanNotFoundError';

export class LoansController {
  async borrow(req: Request, res: Response): Promise<void> {
    const { userId, bookId } = req.body as { userId: string; bookId: string };

    const userRepository = new PrismaUserRepository();
    const bookRepository = new PrismaBookRepository();
    const loanRepository = new PrismaLoanRepository();

    const borrowUseCase = new BorrowUseCase(userRepository, bookRepository, loanRepository);

    try {
      const loan = await borrowUseCase.execute({ userId, bookId });
      res.status(201).json(loan);
    } catch (error) {
      if (error instanceof BookNotAvailableError) {
        res.status(409).json({ error: error.message });
      } else if (error instanceof LimitReachedError) {
        res.status(422).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async returnBook(req: Request, res: Response): Promise<void> {
    const id = req.params['id'] as string;

    const userRepository = new PrismaUserRepository();
    const bookRepository = new PrismaBookRepository();
    const loanRepository = new PrismaLoanRepository();

    const returnUseCase = new ReturnUseCase(loanRepository, bookRepository, userRepository);

    try {
      const loan = await returnUseCase.execute({ loanId: id });
      res.status(200).json(loan);
    } catch (error) {
      if (error instanceof LoanNotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
