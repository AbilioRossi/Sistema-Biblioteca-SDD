import prisma from '../lib/prisma';

export interface PopularBookItem {
  bookTitle: string;
  totalBorrows: number;
}

export class PopularBooksUseCase {
  async execute(): Promise<PopularBookItem[]> {
    const grouped = await prisma.loan.groupBy({
      by: ['bookId'],
      _count: { bookId: true },
      orderBy: { _count: { bookId: 'desc' } },
    });

    const bookIds = grouped.map(g => g.bookId);
    const books = await prisma.book.findMany({ where: { id: { in: bookIds } } });
    const bookMap = new Map(books.map(b => [b.id, b.title]));

    return grouped.map(g => ({
      bookTitle: bookMap.get(g.bookId) ?? 'Desconhecido',
      totalBorrows: g._count.bookId,
    }));
  }
}
