import { Router } from 'express';
import UserController from '../controllers/UserController';
import authMiddleware from '../middleware/auth';

const router = Router();

// Apply the middleware to the routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);

export default router;
