import { Request, Response } from 'express';
import { PrismaUserRepository } from '../repositories/prisma/PrismaUserRepository';
import prisma from '../lib/prisma';

const userRepo = new PrismaUserRepository();

export class UsersController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body as { name: string };
      const user = await userRepo.create({ name });
      res.status(201).json(user);
    } catch {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async list(_req: Request, res: Response): Promise<void> {
    try {
      const users = await prisma.user.findMany();
      res.status(200).json(users);
    } catch {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
