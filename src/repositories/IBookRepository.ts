import { IBook } from '../entities/Book';

export interface IBookRepository {
  findById(id: string): Promise<IBook | null>;
  create(data: { title: string }): Promise<IBook>;
  setAvailability(id: string, isAvailable: boolean): Promise<void>;
}
