import { Router } from 'express';
import EventController from '../controllers/EventController';
import authMiddleware from '../middleware/auth';

const router = Router();

router.post('/events', authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('user', 'admin'), (req, res, next) => {
  console.log('POST /events route hit');
  next();
}, EventController.createEvent);

router.get('/events', authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('user', 'admin'), (req, res, next) => {
  console.log('GET /events route hit');
  next();
}, EventController.getEvents);

router.put('/events/:id', authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('user', 'admin'), (req, res, next) => {
  console.log('PUT /events/:id route hit');
  next();
}, EventController.updateEvent);

router.delete('/events/:id', authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('admin'), (req, res, next) => {
  console.log('DELETE /events/:id route hit');
  next();
}, EventController.deleteEvent);

export default router;
