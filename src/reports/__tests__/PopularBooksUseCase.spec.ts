import { PopularBooksUseCase } from '../PopularBooksUseCase';

jest.mock('../../lib/prisma', () => ({
  __esModule: true,
  default: {
    loan: { groupBy: jest.fn() },
    book: { findMany: jest.fn() },
  },
}));

import prisma from '../../lib/prisma';

const mockGroupBy = prisma.loan.groupBy as jest.Mock;
const mockFindMany = prisma.book.findMany as jest.Mock;

describe('PopularBooksUseCase', () => {
  let useCase: PopularBooksUseCase;

  beforeEach(() => {
    useCase = new PopularBooksUseCase();
  });

  it('deve retornar livros ordenados decrescentemente por totalBorrows', async () => {
    mockGroupBy.mockResolvedValue([
      { bookId: 'b1', _count: { bookId: 5 } },
      { bookId: 'b2', _count: { bookId: 2 } },
    ]);

    mockFindMany.mockResolvedValue([
      { id: 'b1', title: 'Clean Code' },
      { id: 'b2', title: 'The Pragmatic Programmer' },
    ]);

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ bookTitle: 'Clean Code', totalBorrows: 5 });
    expect(result[1]).toEqual({ bookTitle: 'The Pragmatic Programmer', totalBorrows: 2 });
    expect(result[0].totalBorrows).toBeGreaterThan(result[1].totalBorrows);
  });

  it('deve retornar array vazio quando não houver empréstimos', async () => {
    mockGroupBy.mockResolvedValue([]);
    mockFindMany.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});
