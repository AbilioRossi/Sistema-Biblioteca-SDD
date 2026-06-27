import { BorrowUseCase } from '../BorrowUseCase';
import { BookNotAvailableError } from '../../errors/BookNotAvailableError';
import { LimitReachedError } from '../../errors/LimitReachedError';
import { IUserRepository } from '../../repositories/IUserRepository';
import { IBookRepository } from '../../repositories/IBookRepository';
import { ILoanRepository } from '../../repositories/ILoanRepository';
import { ILoan } from '../../entities/Loan';

const makeLoan = (overrides: Partial<ILoan> = {}): ILoan => ({
  id: 'loan-1',
  userId: 'user-1',
  bookId: 'book-1',
  borrowedAt: new Date(),
  penaltyFee: 0,
  ...overrides,
});

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

describe('BorrowUseCase', () => {
  it('UC01 — caso feliz: livro disponível + menos de 3 empréstimos → cria e retorna o Loan', async () => {
    const { userRepository, bookRepository, loanRepository } = makeRepositories();

    bookRepository.findById.mockResolvedValue({ id: 'book-1', title: 'Clean Code', isAvailable: true });
    loanRepository.countActiveByUser.mockResolvedValue(2);
    const expectedLoan = makeLoan();
    loanRepository.create.mockResolvedValue(expectedLoan);

    const useCase = new BorrowUseCase(userRepository, bookRepository, loanRepository);
    const result = await useCase.execute({ userId: 'user-1', bookId: 'book-1' });

    expect(result).toEqual(expectedLoan);
    expect(loanRepository.create).toHaveBeenCalledWith({ userId: 'user-1', bookId: 'book-1' });
    expect(bookRepository.setAvailability).toHaveBeenCalledWith('book-1', false);
    expect(userRepository.incrementActiveLoans).toHaveBeenCalledWith('user-1');
  });

  it('UC02 — limite atingido: countActiveByUser retorna 3 → lança LimitReachedError e não chama create', async () => {
    const { userRepository, bookRepository, loanRepository } = makeRepositories();

    bookRepository.findById.mockResolvedValue({ id: 'book-1', title: 'Clean Code', isAvailable: true });
    loanRepository.countActiveByUser.mockResolvedValue(3);

    const useCase = new BorrowUseCase(userRepository, bookRepository, loanRepository);

    await expect(useCase.execute({ userId: 'user-1', bookId: 'book-1' }))
      .rejects.toThrow(LimitReachedError);

    expect(loanRepository.create).not.toHaveBeenCalled();
  });

  it('livro indisponível: isAvailable === false → lança BookNotAvailableError', async () => {
    const { userRepository, bookRepository, loanRepository } = makeRepositories();

    bookRepository.findById.mockResolvedValue({ id: 'book-1', title: 'Clean Code', isAvailable: false });

    const useCase = new BorrowUseCase(userRepository, bookRepository, loanRepository);

    await expect(useCase.execute({ userId: 'user-1', bookId: 'book-1' }))
      .rejects.toThrow(BookNotAvailableError);

    expect(loanRepository.create).not.toHaveBeenCalled();
  });

  it('livro não encontrado: findById retorna null → lança BookNotAvailableError', async () => {
    const { userRepository, bookRepository, loanRepository } = makeRepositories();

    bookRepository.findById.mockResolvedValue(null);

    const useCase = new BorrowUseCase(userRepository, bookRepository, loanRepository);

    await expect(useCase.execute({ userId: 'user-1', bookId: 'book-1' }))
      .rejects.toThrow(BookNotAvailableError);

    expect(loanRepository.create).not.toHaveBeenCalled();
  });
});
