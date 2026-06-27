import { ILoan } from '../entities/Loan';

export interface ILoanRepository {
  findById(id: string): Promise<ILoan | null>;
  create(data: { userId: string; bookId: string }): Promise<ILoan>;
  update(id: string, data: Partial<Pick<ILoan, 'returnedAt' | 'penaltyFee'>>): Promise<ILoan>;
  countActiveByUser(userId: string): Promise<number>;
}
