import { Router } from 'express'
import { ReportController } from '../reports/ReportController'

const router = Router()
const controller = new ReportController()

router.get('/overdue', (req, res) => controller.overdue(req, res))
router.get('/popular-books', (req, res) => controller.popularBooks(req, res))

export default router
