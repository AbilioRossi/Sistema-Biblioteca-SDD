import { IUser } from '../entities/User';

export interface IUserRepository {
  findById(id: string): Promise<IUser | null>;
  create(data: { name: string }): Promise<IUser>;
  incrementActiveLoans(id: string): Promise<void>;
  decrementActiveLoans(id: string): Promise<void>;
}
