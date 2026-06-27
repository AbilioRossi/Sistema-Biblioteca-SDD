import prisma from '../lib/prisma';

export interface OverdueReportItem {
  userName: string;
  bookTitle: string;
  daysOverdue: number;
  estimatedPenaltyFee: number;
}

export class OverdueReportUseCase {
  async execute(): Promise<OverdueReportItem[]> {
    const overdueThreshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const loans = await prisma.loan.findMany({
      where: { returnedAt: null, borrowedAt: { lt: overdueThreshold } },
      include: { user: true, book: true },
    });

    return loans.map((loan) => {
      const daysOverdue =
        Math.floor((Date.now() - loan.borrowedAt.getTime()) / (1000 * 60 * 60 * 24)) - 7;
      const estimatedPenaltyFee = daysOverdue * 2.0;

      return {
        userName: loan.user.name,
        bookTitle: loan.book.title,
        daysOverdue,
        estimatedPenaltyFee,
      };
    });
  }
}
