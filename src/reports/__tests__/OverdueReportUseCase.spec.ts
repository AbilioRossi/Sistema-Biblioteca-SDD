import { OverdueReportUseCase } from '../OverdueReportUseCase';
import prisma from '../../lib/prisma';

jest.mock('../../lib/prisma', () => ({
  __esModule: true,
  default: {
    loan: {
      findMany: jest.fn(),
    },
  },
}));

const mockFindMany = prisma.loan.findMany as jest.MockedFunction<typeof prisma.loan.findMany>;

describe('OverdueReportUseCase', () => {
  let useCase: OverdueReportUseCase;

  beforeEach(() => {
    useCase = new OverdueReportUseCase();
    jest.clearAllMocks();
  });

  it('deve retornar daysOverdue=3 e estimatedPenaltyFee=6.0 para loan com 10 dias de atraso', async () => {
    const now = Date.now();
    const tenDaysAgo = new Date(now - 10 * 24 * 60 * 60 * 1000);

    mockFindMany.mockResolvedValueOnce([
      {
        id: 'loan-1',
        userId: 'user-1',
        bookId: 'book-1',
        borrowedAt: tenDaysAgo,
        returnedAt: null,
        penaltyFee: 0,
        user: { id: 'user-1', name: 'João Silva', activeLoansCount: 1 },
        book: { id: 'book-1', title: 'Clean Code', isAvailable: false },
      },
    ] as any);

    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0].userName).toBe('João Silva');
    expect(result[0].bookTitle).toBe('Clean Code');
    expect(result[0].daysOverdue).toBe(3);
    expect(result[0].estimatedPenaltyFee).toBe(6.0);
  });

  it('deve retornar array vazio quando não há loans em atraso', async () => {
    mockFindMany.mockResolvedValueOnce([] as any);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});
