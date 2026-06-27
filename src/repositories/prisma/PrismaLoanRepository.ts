import { ILoan } from '../../entities/Loan';
import { ILoanRepository } from '../ILoanRepository';
import prisma from '../../lib/prisma';
import { Loan } from '@prisma/client';

function mapLoan(loan: Loan): ILoan {
  return {
    id: loan.id,
    userId: loan.userId,
    bookId: loan.bookId,
    borrowedAt: loan.borrowedAt,
    returnedAt: loan.returnedAt ?? undefined,
    penaltyFee: loan.penaltyFee,
  };
}

export class PrismaLoanRepository implements ILoanRepository {
  async findById(id: string): Promise<ILoan | null> {
    const loan = await prisma.loan.findUnique({ where: { id } });
    return loan ? mapLoan(loan) : null;
  }

  async create(data: { userId: string; bookId: string }): Promise<ILoan> {
    const loan = await prisma.loan.create({
      data: { userId: data.userId, bookId: data.bookId },
    });
    return mapLoan(loan);
  }

  async update(
    id: string,
    data: Partial<Pick<ILoan, 'returnedAt' | 'penaltyFee'>>,
  ): Promise<ILoan> {
    const loan = await prisma.loan.update({
      where: { id },
      data: {
        returnedAt: data.returnedAt ?? null,
        penaltyFee: data.penaltyFee,
      },
    });
    return mapLoan(loan);
  }

  async countActiveByUser(userId: string): Promise<number> {
    return prisma.loan.count({ where: { userId, returnedAt: null } });
  }
}
