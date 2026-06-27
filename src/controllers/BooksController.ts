import { Request, Response } from 'express';
import { PrismaBookRepository } from '../repositories/prisma/PrismaBookRepository';
import prisma from '../lib/prisma';

const bookRepo = new PrismaBookRepository();

export class BooksController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { title } = req.body as { title: string };
      const book = await bookRepo.create({ title });
      res.status(201).json(book);
    } catch {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async list(_req: Request, res: Response): Promise<void> {
    try {
      const books = await prisma.book.findMany();
      res.status(200).json(books);
    } catch {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
