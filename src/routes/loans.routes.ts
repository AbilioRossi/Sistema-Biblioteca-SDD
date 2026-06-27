import { Router } from 'express';
import { LoansController } from '../controllers/LoansController';

const router = Router();
const controller = new LoansController();

router.get('/', (req, res) => controller.list(req, res));
router.post('/', (req, res) => controller.borrow(req, res));
router.put('/:id/return', (req, res) => controller.returnBook(req, res));

export default router;
