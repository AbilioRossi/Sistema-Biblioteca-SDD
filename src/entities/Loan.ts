export interface ILoan {
  id: string;
  userId: string;
  bookId: string;
  borrowedAt: Date;
  returnedAt?: Date;
  penaltyFee: number;
}
