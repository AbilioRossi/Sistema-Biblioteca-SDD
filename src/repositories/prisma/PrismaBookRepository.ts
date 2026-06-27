import { IBook } from '../../entities/Book';
import { IBookRepository } from '../IBookRepository';
import prisma from '../../lib/prisma';

export class PrismaBookRepository implements IBookRepository {
  async findById(id: string): Promise<IBook | null> {
    return prisma.book.findUnique({ where: { id } });
  }

  async create(data: { title: string }): Promise<IBook> {
    return prisma.book.create({ data: { title: data.title } });
  }

  async setAvailability(id: string, isAvailable: boolean): Promise<void> {
    await prisma.book.update({
      where: { id },
      data: { isAvailable },
    });
  }
}
