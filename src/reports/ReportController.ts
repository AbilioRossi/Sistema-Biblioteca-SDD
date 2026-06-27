import { Request, Response } from 'express'
import { OverdueReportUseCase } from './OverdueReportUseCase'
import { PopularBooksUseCase } from './PopularBooksUseCase'

export class ReportController {
  async overdue(_req: Request, res: Response): Promise<void> {
    try {
      const useCase = new OverdueReportUseCase()
      const data = await useCase.execute()
      res.status(200).json(data)
    } catch {
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  async popularBooks(_req: Request, res: Response): Promise<void> {
    try {
      const useCase = new PopularBooksUseCase()
      const data = await useCase.execute()
      res.status(200).json(data)
    } catch {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}
