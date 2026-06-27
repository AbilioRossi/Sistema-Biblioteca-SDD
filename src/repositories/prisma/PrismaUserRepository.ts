import { IUser } from '../../entities/User';
import { IUserRepository } from '../IUserRepository';
import prisma from '../../lib/prisma';

export class PrismaUserRepository implements IUserRepository {
  async findById(id: string): Promise<IUser | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async create(data: { name: string }): Promise<IUser> {
    return prisma.user.create({ data: { name: data.name } });
  }

  async incrementActiveLoans(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { activeLoansCount: { increment: 1 } },
    });
  }

  async decrementActiveLoans(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { activeLoansCount: { decrement: 1 } },
    });
  }
}
