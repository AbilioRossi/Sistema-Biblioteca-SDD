import { ReturnUseCase } from '../ReturnUseCase';
import { LoanNotFoundError } from '../../errors/LoanNotFoundError';
import { IUserRepository } from '../../repositories/IUserRepository';
import { IBookRepository } from '../../repositories/IBookRepository';
import { ILoanRepository } from '../../repositories/ILoanRepository';
import { ILoan } from '../../entities/Loan';

const makeRepositories = () => {
  const userRepository: jest.Mocked<IUserRepository> = {
    findById: jest.fn(),
    create: jest.fn(),
    incrementActiveLoans: jest.fn().mockResolvedValue(undefined),
    decrementActiveLoans: jest.fn().mockResolvedValue(undefined),
  };

  const bookRepository: jest.Mocked<IBookRepository> = {
    findById: jest.fn(),
    create: jest.fn(),
    setAvailability: jest.fn().mockResolvedValue(undefined),
  };

  const loanRepository: jest.Mocked<ILoanRepository> = {
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    countActiveByUser: jest.fn(),
  };

  return { userRepository, bookRepository, loanRepository };
};

const daysAgo = (days: number): Date => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
};

const makeLoan = (overrides: Partial<ILoan> = {}): ILoan => ({
  id: 'loan-1',
  userId: 'user-1',
  bookId: 'book-1',
  borrowedAt: daysAgo(0),
  penaltyFee: 0,
  ...overrides,
});

describe('ReturnUseCase', () => {
  it('UC03 — devolução com atraso: 10 dias após empréstimo → penaltyFee deve ser 6.00', async () => {
    const { userRepository, bookRepository, loanRepository } = makeRepositories();

    const loan = makeLoan({ borrowedAt: daysAgo(10) });
    const updatedLoan: ILoan = { ...loan, returnedAt: new Date(), penaltyFee: 6.0 };

    loanRepository.findById.mockResolvedValue(loan);
    loanRepository.update.mockResolvedValue(updatedLoan);

    const useCase = new ReturnUseCase(loanRepository, bookRepository, userRepository);
    const result = await useCase.execute({ loanId: 'loan-1' });

    expect(result.penaltyFee).toBe(6.0);
    expect(loanRepository.update).toHaveBeenCalledWith(
      'loan-1',
      expect.objectContaining({ penaltyFee: 6.0 }),
    );
    expect(bookRepository.setAvailability).toHaveBeenCalledWith('book-1', true);
    expect(userRepository.decrementActiveLoans).toHaveBeenCalledWith('user-1');
  });

  it('devolução no prazo: 5 dias após empréstimo → penaltyFee deve ser 0', async () => {
    const { userRepository, bookRepository, loanRepository } = makeRepositories();

    const loan = makeLoan({ borrowedAt: daysAgo(5) });
    const updatedLoan: ILoan = { ...loan, returnedAt: new Date(), penaltyFee: 0 };

    loanRepository.findById.mockResolvedValue(loan);
    loanRepository.update.mockResolvedValue(updatedLoan);

    const useCase = new ReturnUseCase(loanRepository, bookRepository, userRepository);
    const result = await useCase.execute({ loanId: 'loan-1' });

    expect(result.penaltyFee).toBe(0);
    expect(loanRepository.update).toHaveBeenCalledWith(
      'loan-1',
      expect.objectContaining({ penaltyFee: 0 }),
    );
  });

  it('devolução no exato prazo limite: 7 dias após empréstimo → penaltyFee deve ser 0', async () => {
    const { userRepository, bookRepository, loanRepository } = makeRepositories();

    const loan = makeLoan({ borrowedAt: daysAgo(7) });
    const updatedLoan: ILoan = { ...loan, returnedAt: new Date(), penaltyFee: 0 };

    loanRepository.findById.mockResolvedValue(loan);
    loanRepository.update.mockResolvedValue(updatedLoan);

    const useCase = new ReturnUseCase(loanRepository, bookRepository, userRepository);
    const result = await useCase.execute({ loanId: 'loan-1' });

    expect(result.penaltyFee).toBe(0);
  });

  it('empréstimo inexistente: findById retorna null → deve lançar LoanNotFoundError', async () => {
    const { userRepository, bookRepository, loanRepository } = makeRepositories();

    loanRepository.findById.mockResolvedValue(null);

    const useCase = new ReturnUseCase(loanRepository, bookRepository, userRepository);

    await expect(useCase.execute({ loanId: 'loan-inexistente' }))
      .rejects.toThrow(LoanNotFoundError);

    expect(loanRepository.update).not.toHaveBeenCalled();
    expect(bookRepository.setAvailability).not.toHaveBeenCalled();
    expect(userRepository.decrementActiveLoans).not.toHaveBeenCalled();
  });
});
