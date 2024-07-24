import { Router } from 'express';
import EventController from '../controllers/EventController';
import authMiddleware from '../middleware/auth';

const router = Router();

// Apply the middleware to the routes
router.post('/events', authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('user', 'admin'), EventController.createEvent);
router.get('/events', authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('user', 'admin'), EventController.getEvents);
router.put('/events/:id', authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('user', 'admin'), EventController.updateEvent);
router.delete('/events/:id', authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('admin'), EventController.deleteEvent);

export default router;
