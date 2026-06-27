import { Router } from 'express';
import { UsersController } from '../controllers/UsersController';

const router = Router();
const controller = new UsersController();

router.post('/', (req, res) => controller.create(req, res));
router.get('/', (req, res) => controller.list(req, res));

export default router;
