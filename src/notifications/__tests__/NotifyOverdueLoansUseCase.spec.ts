import { NotifyOverdueLoansUseCase } from '../NotifyOverdueLoansUseCase'
import { EmailService } from '../EmailService'
import prisma from '../../lib/prisma'

jest.mock('../../lib/prisma', () => ({
  __esModule: true,
  default: {
    loan: {
      findMany: jest.fn(),
    },
  },
}))

const mockFindMany = prisma.loan.findMany as jest.Mock

describe('NotifyOverdueLoansUseCase', () => {
  let emailService: jest.Mocked<EmailService>
  let useCase: NotifyOverdueLoansUseCase

  beforeEach(() => {
    emailService = {
      sendEmail: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<EmailService>

    useCase = new NotifyOverdueLoansUseCase(emailService)
  })

  it('Cenário 1: empréstimo com 10 dias de atraso → sendEmail chamado 1x com multa R$ 6', async () => {
    // borrowedAt = 10 dias atrás: 3 dias além do prazo de 7 dias → daysLate=3, penaltyFee=3×2=6
    const borrowedAt = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)

    mockFindMany.mockResolvedValue([
      {
        id: 'loan-1',
        userId: 'user-1',
        bookId: 'book-1',
        borrowedAt,
        returnedAt: null,
        penaltyFee: 0,
        user: { id: 'user-1', name: 'João Silva', activeLoansCount: 1 },
        book: { id: 'book-1', title: 'Clean Code', isAvailable: false },
      },
    ])

    await useCase.execute()

    expect(emailService.sendEmail).toHaveBeenCalledTimes(1)

    const callArgs = emailService.sendEmail.mock.calls[0][0]
    expect(callArgs.subject).toBe('Aviso de Atraso')
    expect(callArgs.text).toContain('R$ 6')
  })

  it('Cenário 2: nenhum empréstimo em atraso → sendEmail não deve ser chamado', async () => {
    mockFindMany.mockResolvedValue([])

    await useCase.execute()

    expect(emailService.sendEmail).not.toHaveBeenCalled()
  })
})
