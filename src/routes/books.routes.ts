import { Router } from 'express';
import { BooksController } from '../controllers/BooksController';

const router = Router();
const controller = new BooksController();

router.post('/', (req, res) => controller.create(req, res));
router.get('/', (req, res) => controller.list(req, res));

export default router;
